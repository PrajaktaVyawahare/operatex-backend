// src/modules/tool-master/tool.repository.js

const db = require("../../../db/connection");
const query = require("./tool.query");

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

        case "LIFE": {

            const result = await db.query(

                query.INSERT_LIFE_CONFIG,

                [

                    payload.tool_id,

                    payload.life_source,

                    payload.warning_percent,

                    payload.critical_percent,

                    payload.auto_lock,

                    payload.status || "ACTIVE"

                ]

            );

            return result.rows[0];

        }

        case "CALIBRATION": {

            const result = await db.query(

                query.INSERT_CALIBRATION_CONFIG,

                [

                    payload.tool_id,

                    payload.calibration_type,

                    payload.calibration_interval,

                    payload.next_calibration,

                    payload.calibration_by,

                    payload.status || "ACTIVE"

                ]

            );

            return result.rows[0];

        }

        default:

            throw new Error(
                "Invalid config type"
            );

    }

}
// ==========================================================
// CONFIG - TOOL LIFE
// ==========================================================

async function getToolLife() {

    const result =
        await db.query(
            query.GET_TOOL_LIFE
        );

    return result.rows;

}

// ==========================================================
// CONFIG - TOOL CALIBRATION
// ==========================================================

async function getToolCalibration() {

    const result =
        await db.query(
            query.GET_TOOL_CALIBRATION
        );

    return result.rows;

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

    switch (table.toUpperCase()) {

        case "LIFE":

            sql = `

                UPDATE tool_life_config

                SET

                    ${fields.join(", ")}

                WHERE

                    config_id=$${index}

                RETURNING *;

            `;

            break;

        case "CALIBRATION":

            sql = `

                UPDATE tool_calibration_config

                SET

                    ${fields.join(", ")}

                WHERE

                    calibration_id=$${index}

                RETURNING *;

            `;

            break;

        default:

            throw new Error(
                "Invalid config type"
            );

    }

    const result = await db.query(

        sql,

        values

    );

    return result.rows[0];

}

// ==========================================================
// DELETE CONFIG
// ==========================================================

async function deleteConfig(table, id) {

    let sql = "";

    switch (table.toUpperCase()) {

        case "LIFE":

            sql = `

                UPDATE tool_life_config

                SET

                    status='INACTIVE',

                    updated_at=NOW()

                WHERE

                    config_id=$1

                RETURNING *;

            `;

            break;

        case "CALIBRATION":

            sql = `

                UPDATE tool_calibration_config

                SET

                    status='INACTIVE',

                    updated_at=NOW()

                WHERE

                    calibration_id=$1

                RETURNING *;

            `;

            break;

        default:

            throw new Error(
                "Invalid config type"
            );

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

            payload.machine_id,

            payload.tool_no,

            payload.tool_name,

            payload.tool_type,

            payload.manufacturer,

            payload.model_no,

            payload.life_limit,

            payload.warning_threshold,

            payload.critical_threshold,

            payload.current_usage,

            payload.unit,

            payload.status

        ]

    );

    return result.rows[0];

}

// ==========================================================
// UPDATE MASTER
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

        UPDATE tool_master

        SET

            ${fields.join(", ")}

        WHERE

            tool_id=$${index}

        RETURNING *;

    `;

    const result = await db.query(

        sql,

        values

    );

    return result.rows[0];

}

// ==========================================================
// DELETE MASTER
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

        filters.tool_id || null,

        filters.machine_id || null

    ];

    const sql = `

        SELECT

            tm.tool_id,

            tm.tool_no,

            tm.tool_name,

            mm.machine_name,

            tue.event_id,

            tue.cycle_count,

            tue.usage_count,

            tue.event_ts AS usage_time,

            tre.replacement_id,

            tre.reason,

            tre.replaced_by,

            tre.replacement_date,

            toe.offset_id,

            toe.offset_no,

            toe.value,

            toe.delta,

            toe.event_ts AS offset_time

        FROM tool_master tm

        INNER JOIN machine_master mm
            ON tm.machine_id = mm.machine_id

        LEFT JOIN tool_usage_event tue
            ON tm.tool_id = tue.tool_id

        LEFT JOIN tool_replacement_event tre
            ON tm.tool_id = tre.tool_id

        LEFT JOIN tool_offset_event toe
            ON tm.tool_id = toe.tool_id

        WHERE

            (
                $1::integer IS NULL
                OR tm.tool_id = $1
            )

        AND

            (
                $2::integer IS NULL
                OR tm.machine_id = $2
            )

        ORDER BY

            tue.event_ts DESC NULLS LAST,

            tre.replacement_date DESC NULLS LAST,

            toe.event_ts DESC NULLS LAST;

    `;

    const result = await db.query(sql, values);

    return result.rows;

}
// ==========================================================
// EXECUTE
// ==========================================================

async function execute(payload) {

    switch (payload.event_type.toUpperCase()) {

        // ==========================================
        // TOOL USAGE
        // ==========================================

        case "USAGE": {

            const result = await db.query(

                query.INSERT_USAGE_EVENT,

                [

                    payload.tool_id,

                    payload.cycle_count,

                    payload.usage_count,

                    payload.remarks

                ]

            );

            return result.rows[0];

        }

        // ==========================================
        // TOOL REPLACEMENT
        // ==========================================

        case "REPLACEMENT": {

            const result = await db.query(

                query.INSERT_REPLACEMENT_EVENT,

                [

                    payload.tool_id,

                    payload.reason,

                    payload.replaced_by,

                    payload.remarks

                ]

            );

            return result.rows[0];

        }

        // ==========================================
        // TOOL OFFSET
        // ==========================================

        case "OFFSET": {

            const result = await db.query(

                query.INSERT_OFFSET_EVENT,

                [

                    payload.tool_id,

                    payload.offset_no,

                    payload.value,

                    payload.delta

                ]

            );

            return result.rows[0];

        }

        default:

            throw new Error(
                "Invalid event type"
            );

    }

}

// ==========================================================
// REPORT
// ==========================================================

async function getReport(filters = {}) {

    const values = [

        filters.machine_id || null,

        filters.status || null

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

        filters.machine_id || null,

        filters.status || null

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

async function checkDuplicateToolNo(toolNo) {

    const result = await db.query(

        query.CHECK_DUPLICATE_TOOL_NO,

        [toolNo]

    );

    return result.rows[0];

}

async function checkDuplicateToolName(toolName) {

    const result = await db.query(

        query.CHECK_DUPLICATE_TOOL_NAME,

        [toolName]

    );

    return result.rows[0];

}

async function checkDuplicateToolNoForUpdate(toolNo, id) {

    const result = await db.query(

        query.CHECK_DUPLICATE_TOOL_NO_FOR_UPDATE,

        [

            toolNo,

            id

        ]

    );

    return result.rows[0];

}

async function checkDuplicateToolNameForUpdate(toolName, id) {

    const result = await db.query(

        query.CHECK_DUPLICATE_TOOL_NAME_FOR_UPDATE,

        [

            toolName,

            id

        ]

    );

    return result.rows[0];

}

// ==========================================================
// FK VALIDATION
// ==========================================================

async function checkMachine(machineId) {

    const result = await db.query(

        `

        SELECT

            machine_id,

            machine_name

        FROM machine_master

        WHERE machine_id = $1

        `,

        [machineId]

    );

    return result.rows[0];

}

async function checkTool(toolId) {

    const result = await db.query(

        `

        SELECT

            tool_id,

            tool_no,

            tool_name

        FROM tool_master

        WHERE tool_id = $1

        `,

        [toolId]

    );

    return result.rows[0];

}

// ==========================================================
// EXPORTS
// ==========================================================

module.exports = {

    // Config

    getConfig,

    getConfigById,

    createConfig,

    updateConfig,

    deleteConfig,
    getToolLife,

getToolCalibration,

    // Master

    getMaster,

    getMasterById,

    createMaster,

    updateMaster,

    deleteMaster,

    // Runtime

    getRuntime,

    execute,

    // Report

    getReport,

    exportData,

    // Duplicate Checks

    checkDuplicateToolNo,

    checkDuplicateToolName,

    checkDuplicateToolNoForUpdate,

    checkDuplicateToolNameForUpdate,

    // Validation

    checkMachine,

    checkTool

};