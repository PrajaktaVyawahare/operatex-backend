// src/modules/gauge-instrument-master/gauge.repository.js

const db = require("../../../db/connection");
const query = require("./gauge.query");

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
// CONFIG - PARAMETER
// ==========================================================

async function getParameters() {

    const result =
        await db.query(
            query.GET_PARAMETERS
        );

    return result.rows;

}

// ==========================================================
// CONFIG - CALIBRATION
// ==========================================================

async function getCalibrations() {

    const result =
        await db.query(
            query.GET_CALIBRATIONS
        );

    return result.rows;

}

// ==========================================================
// CREATE CONFIG
// ==========================================================

async function createConfig(payload) {

    switch (payload.config_type.toUpperCase()) {

        // ==========================================
        // PARAMETER CONFIG
        // ==========================================

        case "PARAMETER": {

            const result = await db.query(

                query.INSERT_PARAMETER_CONFIG,

                [

                    payload.gauge_id,

                    payload.parameter_name,

                    payload.lsl,

                    payload.usl,

                    payload.unit,

                    payload.status || "ACTIVE"

                ]

            );

            return result.rows[0];

        }

        // ==========================================
        // CALIBRATION CONFIG
        // ==========================================

        case "CALIBRATION": {

            const result = await db.query(

                query.INSERT_CALIBRATION_SCHEDULE,

                [

                    payload.asset_id,

                    payload.asset_type,

                    payload.due_date,

                    payload.frequency_days,

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

        case "PARAMETER":

            sql = `

                UPDATE gauge_parameter_config

                SET

                    ${fields.join(", ")}

                WHERE

                    parameter_id=$${index}

                RETURNING *;

            `;

            break;

        case "CALIBRATION":

            sql = `

                UPDATE calibration_schedule

                SET

                    ${fields.join(", ")}

                WHERE

                    schedule_id=$${index}

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

        case "PARAMETER":

            sql = `

                UPDATE gauge_parameter_config

                SET

                    status='INACTIVE',

                    updated_at=NOW()

                WHERE

                    parameter_id=$1

                RETURNING *;

            `;

            break;

        case "CALIBRATION":

            sql = `

                UPDATE calibration_schedule

                SET

                    status='INACTIVE',

                    updated_at=NOW()

                WHERE

                    schedule_id=$1

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

            payload.gauge_no,

            payload.gauge_name,

            payload.gauge_type,

            payload.manufacturer,

            payload.model_no,

            payload.serial_no,

           

           

            payload.accuracy,

          

            payload.location,

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

        UPDATE gauge_master

        SET

            ${fields.join(", ")}

        WHERE

            gauge_id=$${index}

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

        filters.gauge_id || null,

        filters.status || null

    ];

    const sql = `

        SELECT

            gm.gauge_id,

            gm.gauge_no,

            gm.gauge_name,

            gl.log_id,

            gl.parameter_name,

            gl.measured_value,

            gl.result,

            gl.remarks,

            gl.event_ts,

            ce.event_id,

            ce.result AS calibration_result,

            ce.certificate_path,

            ce.calibrated_by,

            ce.event_ts AS calibration_time

        FROM gauge_master gm

        LEFT JOIN gauge_log gl

            ON gm.gauge_id = gl.gauge_id

        LEFT JOIN calibration_event ce

            ON gm.gauge_id = ce.asset_id

        WHERE

            (

                $1::integer IS NULL

                OR gm.gauge_id = $1

            )

        AND

            (

                $2::varchar IS NULL

                OR gm.status = $2

            )

        ORDER BY

            gl.event_ts DESC NULLS LAST,

            ce.event_ts DESC NULLS LAST;

    `;

    const result = await db.query(

        sql,

        values

    );

    return result.rows;

}

// ==========================================================
// EXECUTE
// ==========================================================

async function execute(payload) {

    switch (payload.event_type.toUpperCase()) {

        // ==========================================
        // GAUGE LOG
        // ==========================================

        case "GAUGE": {

            const result = await db.query(

                query.INSERT_GAUGE_LOG,

                [

                    payload.gauge_id,

                    payload.parameter_name,

                    payload.measured_value,

                    payload.result,

                    payload.remarks

                ]

            );

            return result.rows[0];

        }

        // ==========================================
        // CALIBRATION EVENT
        // ==========================================

        case "CALIBRATION": {

            const result = await db.query(

                query.INSERT_CALIBRATION_EVENT,

                [

                    payload.asset_id,

                    payload.result,

                    payload.certificate_path,

                    payload.calibrated_by,

                    payload.remarks

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

async function checkDuplicateGaugeNo(gaugeNo) {

    const result = await db.query(

        query.CHECK_DUPLICATE_GAUGE_NO,

        [gaugeNo]

    );

    return result.rows[0];

}

async function checkDuplicateGaugeName(gaugeName) {

    const result = await db.query(

        query.CHECK_DUPLICATE_GAUGE_NAME,

        [gaugeName]

    );

    return result.rows[0];

}

async function checkDuplicateGaugeNoForUpdate(gaugeNo, id) {

    const result = await db.query(

        query.CHECK_DUPLICATE_GAUGE_NO_FOR_UPDATE,

        [

            gaugeNo,

            id

        ]

    );

    return result.rows[0];

}

async function checkDuplicateGaugeNameForUpdate(gaugeName, id) {

    const result = await db.query(

        query.CHECK_DUPLICATE_GAUGE_NAME_FOR_UPDATE,

        [

            gaugeName,

            id

        ]

    );

    return result.rows[0];

}

// ==========================================================
// VALIDATION
// ==========================================================

async function checkGauge(gaugeId) {

    const result = await db.query(

        `

        SELECT

            gauge_id,

            gauge_no,

            gauge_name,

            status

        FROM gauge_master

        WHERE gauge_id = $1

        `,

        [gaugeId]

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
    getParameters,

getCalibrations,

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

    checkDuplicateGaugeNo,

    checkDuplicateGaugeName,

    checkDuplicateGaugeNoForUpdate,

    checkDuplicateGaugeNameForUpdate,

    // Validation

    checkGauge

};