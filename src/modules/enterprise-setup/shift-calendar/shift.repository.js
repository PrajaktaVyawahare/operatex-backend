// src/modules/shift-calendar/shift.repository.js

const db = require("../../../db/connection");
const query = require("./shift.query");

// ==========================================================
// CONFIG
// ==========================================================

async function getConfig() {

    const result = await db.query(
        query.GET_CONFIG
    );

    return result.rows;

}

async function getConfigById(id) {

    const result = await db.query(
        query.GET_CONFIG_BY_ID,
        [id]
    );

    return result.rows[0];

}

// ==========================================================
// CREATE CONFIG
// ==========================================================

async function createConfig(payload) {

    switch (payload.config_type.toUpperCase()) {

        case "BREAK": {

            const result = await db.query(

                query.INSERT_BREAK,

                [

                    payload.shift_id,

                    payload.break_name,

                    payload.break_start_time,

                    payload.break_end_time,

                    payload.include_in_oee,

                    payload.status || "ACTIVE"

                ]

            );

            return result.rows[0];

        }

        case "CALENDAR": {

            const result = await db.query(

                query.INSERT_CALENDAR,

                [

                    payload.shift_id,

                    payload.work_date,

                    payload.shift_status,

                    payload.remarks

                ]

            );

            return result.rows[0];

        }

        case "HOLIDAY": {

            const result = await db.query(

                query.INSERT_HOLIDAY,

                [

                    payload.plant_id,

                    payload.holiday_date,

                    payload.reason,

                    payload.is_paid

                ]

            );

            return result.rows[0];

        }

        default:

            throw new Error("Invalid config type");

    }

}

// ==========================================================
// UPDATE CONFIG
// ==========================================================

async function updateConfig(table, id, payload) {

    const fields = [];

    const values = [];

    let index = 1;

    Object.keys(payload).forEach((key) => {

        fields.push(`${key}=$${index}`);

        values.push(payload[key]);

        index++;

    });

    fields.push("updated_at=NOW()");

    values.push(id);

    let sql = "";

    switch (table) {

        case "BREAK":

            sql = `

                UPDATE break_config

                SET ${fields.join(", ")}

                WHERE break_id=$${index}

                RETURNING *;

            `;

            break;

        case "CALENDAR":

            sql = `

                UPDATE shift_calendar

                SET ${fields.join(", ")}

                WHERE calendar_id=$${index}

                RETURNING *;

            `;

            break;

        case "HOLIDAY":

            sql = `

                UPDATE holiday_calendar

                SET ${fields.join(", ")}

                WHERE holiday_id=$${index}

                RETURNING *;

            `;

            break;

        default:

            throw new Error("Invalid config type");

    }

    const result = await db.query(sql, values);

    return result.rows[0];

}

// ==========================================================
// DELETE CONFIG (Soft Delete)
// ==========================================================

async function deleteConfig(table, id) {

    let sql = "";

    switch (table) {

        case "BREAK":

            sql = `

                UPDATE break_config

                SET

                    status='INACTIVE',

                    updated_at=NOW()

                WHERE break_id=$1

                RETURNING *;

            `;

            break;

        case "CALENDAR":

            sql = `

                UPDATE shift_calendar

                SET

                    shift_status='INACTIVE',

                    updated_at=NOW()

                WHERE calendar_id=$1

                RETURNING *;

            `;

            break;

        case "HOLIDAY":

            sql = `

                DELETE FROM holiday_calendar

                WHERE holiday_id=$1

                RETURNING *;

            `;

            break;

        default:

            throw new Error("Invalid config type");

    }

    const result = await db.query(

        sql,

        [id]

    );

    return result.rows[0];

}

// ==========================================================
// MASTER
// ==========================================================

async function getMaster() {

    const result = await db.query(
        query.GET_MASTER
    );

    return result.rows;

}

async function getMasterById(id) {

    const result = await db.query(

        query.GET_MASTER_BY_ID,

        [id]

    );

    return result.rows[0];

}

// ==========================================================
// CREATE MASTER
// ==========================================================

async function createMaster(payload) {

    const result = await db.query(

        query.INSERT_MASTER,

        [

            payload.shift_no,

            payload.shift_name,

            payload.shift_start_time,

            payload.shift_end_time,

            payload.shift_duration,

            payload.is_night_shift,

            payload.line_id,

            payload.status

        ]

    );

    return result.rows[0];

}

// ==========================================================
// UPDATE MASTER (Dynamic)
// ==========================================================

async function updateMaster(id, payload) {

    const fields = [];

    const values = [];

    let index = 1;

    Object.keys(payload).forEach((key) => {

        fields.push(`${key}=$${index}`);

        values.push(payload[key]);

        index++;

    });

    fields.push("updated_at=NOW()");

    values.push(id);

    const sql = `

        UPDATE shift_master

        SET

            ${fields.join(", ")}

        WHERE

            shift_id=$${index}

        RETURNING *;

    `;

    const result = await db.query(

        sql,

        values

    );

    return result.rows[0];

}

// ==========================================================
// DELETE MASTER (Soft Delete)
// ==========================================================

async function deleteMaster(id) {

    const result = await db.query(

        query.DELETE_MASTER,

        [id]

    );

    return result.rows[0];

}

// ==========================================================
// RUNTIME
// ==========================================================

async function getRuntime(filters = {}) {

    const values = [

        filters.shift_id || null,

        filters.runtime_status || null,

        filters.from_date || null,

        filters.to_date || null

    ];

    const sql = `

        SELECT

            srl.runtime_id,

            sm.shift_id,

            sm.shift_no,

            sm.shift_name,

            sc.work_date,

            bc.break_name,

            hc.reason AS holiday_reason,

            srl.runtime_date,

            srl.shift_start_time,

            srl.shift_end_time,

            srl.actual_start_time,

            srl.actual_end_time,

            srl.runtime_status,

            srl.remarks,

            srl.created_at

        FROM shift_runtime_log srl

        INNER JOIN shift_master sm

            ON srl.shift_id = sm.shift_id

        LEFT JOIN shift_calendar sc

            ON srl.calendar_id = sc.calendar_id

        LEFT JOIN break_config bc

            ON srl.break_id = bc.break_id

        LEFT JOIN holiday_calendar hc

            ON srl.holiday_id = hc.holiday_id

        WHERE

            ($1::integer IS NULL OR sm.shift_id = $1)

        AND ($2::varchar IS NULL OR srl.runtime_status = $2)

        AND ($3::date IS NULL OR srl.runtime_date >= $3)

        AND ($4::date IS NULL OR srl.runtime_date <= $4)

        ORDER BY

            srl.runtime_date DESC,

            sm.shift_no;

    `;

    const result = await db.query(sql, values);

    return result.rows;

}

async function getRuntimeData(id){

    const result = await db.query(

        query.GET_RUNTIME_DATA,

        [id]

    );

    return result.rows[0];

}

// ==========================================================
// EXECUTE
// ==========================================================

async function execute(payload) {

    const result = await db.query(

        query.INSERT_RUNTIME,

        [

            payload.shift_id,

            payload.calendar_id,

            payload.break_id,

            payload.holiday_id,

            payload.runtime_date,

            payload.shift_start_time,

            payload.shift_end_time,

            payload.actual_start_time,

            payload.actual_end_time,

            payload.runtime_status,

            payload.remarks

        ]

    );

    return result.rows[0];

}

// ==========================================================
// REPORT
// ==========================================================

async function getReport(filters = {}) {

    const values = [

        filters.line_id || null,

        filters.status || null,

        filters.from_date || null,

        filters.to_date || null

    ];

    const result = await db.query(

        query.GET_REPORT,

        values

    );

    return result.rows;

}

// ==========================================================
// EXPORT
// ==========================================================

async function exportData(filters = {}) {

    const values = [

        filters.line_id || null,

        filters.status || null,

        filters.from_date || null,

        filters.to_date || null

    ];

    const result = await db.query(

        query.GET_REPORT,

        values

    );

    return result.rows;

}

// ==========================================================
// DUPLICATE CHECKS
// ==========================================================

async function checkDuplicateShiftNo(shiftNo) {

    const result = await db.query(

        query.CHECK_DUPLICATE_SHIFT_NO,

        [shiftNo]

    );

    return result.rows[0];

}

async function checkDuplicateShiftName(shiftName) {

    const result = await db.query(

        query.CHECK_DUPLICATE_SHIFT_NAME,

        [shiftName]

    );

    return result.rows[0];

}
async function checkDuplicateShiftNoForUpdate(shiftNo, id) {

    const result = await db.query(

        query.CHECK_DUPLICATE_SHIFT_NO_FOR_UPDATE,

        [

            shiftNo,

            id

        ]

    );

    return result.rows[0];

}

async function checkDuplicateShiftNameForUpdate(shiftName, id) {

    const result = await db.query(

        query.CHECK_DUPLICATE_SHIFT_NAME_FOR_UPDATE,

        [

            shiftName,

            id

        ]

    );

    return result.rows[0];

}
// ==========================================================
// FK VALIDATION
// ==========================================================

async function checkLine(lineId) {

    const result = await db.query(

        `

        SELECT

            line_id,

            line_name

        FROM line_master

        WHERE line_id=$1

        `,

        [lineId]

    );

    return result.rows[0];

}

// ==========================================================
// EXPORTS
// ==========================================================

module.exports = {

    getConfig,

    getConfigById,

    createConfig,

    updateConfig,

    deleteConfig,

    getMaster,

    getMasterById,

    createMaster,

    updateMaster,

    deleteMaster,

    getRuntime,

    execute,

    getReport,

    exportData,

    checkDuplicateShiftNo,

    checkDuplicateShiftName,
      checkDuplicateShiftNoForUpdate,

    checkDuplicateShiftNameForUpdate,

    checkLine,
    getRuntimeData,      
};