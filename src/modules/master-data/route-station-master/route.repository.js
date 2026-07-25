// src/modules/route-station-master/route.repository.js

const db = require("../../../db/connection");
const query = require("./route.query");

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

        case "STEP": {

            const result = await db.query(

                query.INSERT_ROUTE_STEP,

                [

                    payload.route_id,

                    payload.sequence_no,

                    payload.machine_id,

                    payload.station_id,

                    payload.operation_id,

                    payload.cycle_time,

                    payload.setup_time,

                    payload.status || "ACTIVE"

                ]

            );

            return result.rows[0];

        }

        case "VALIDATION": {

            const result = await db.query(

                query.INSERT_ROUTE_VALIDATION,

                [

                    payload.route_step_id,

                    payload.validation_name,

                    payload.expression,

                    payload.error_message,

                    payload.is_mandatory,

                    payload.status || "ACTIVE"

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

    switch (table.toUpperCase()) {

        case "STEP":

            sql = `

                UPDATE route_step

                SET ${fields.join(", ")}

                WHERE route_step_id=$${index}

                RETURNING *;

            `;

            break;

        case "VALIDATION":

            sql = `

                UPDATE route_validation_config

                SET ${fields.join(", ")}

                WHERE validation_id=$${index}

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
// DELETE CONFIG
// ==========================================================

async function deleteConfig(table, id) {

    let sql = "";

    switch (table.toUpperCase()) {

        case "STEP":

            sql = `

                UPDATE route_step

                SET

                    status='INACTIVE',

                    updated_at=NOW()

                WHERE route_step_id=$1

                RETURNING *;

            `;

            break;

        case "VALIDATION":

            sql = `

                UPDATE route_validation_config

                SET

                    status='INACTIVE',

                    updated_at=NOW()

                WHERE validation_id=$1

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

            payload.part_id,

            payload.route_code,

            payload.route_name,

            payload.revision,

            payload.is_active,

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

        UPDATE route_master

        SET

            ${fields.join(", ")}

        WHERE

            route_id=$${index}

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

        filters.route_id || null,

        filters.station_id || null,

        filters.event_type || null,

        filters.from_date || null,

        filters.to_date || null

    ];

    const sql = `

        SELECT

            ree.event_id,

            rm.route_id,

            rm.route_code,

            rm.route_name,

            pm.part_code,

            pm.part_name,

            rs.sequence_no,

            sm.station_name,

            mm.machine_name,

            om.operation_name,

            ree.event_type,

            ree.event_time,

            ree.remarks,

            ree.created_by,

            ree.created_at

        FROM route_execution_event ree

        INNER JOIN route_master rm
            ON ree.route_id = rm.route_id

        INNER JOIN part_master pm
            ON rm.part_id = pm.part_id

        LEFT JOIN route_step rs
            ON ree.route_step_id = rs.route_step_id

        LEFT JOIN station_master sm
            ON ree.station_id = sm.station_id

        LEFT JOIN machine_master mm
            ON ree.machine_id = mm.machine_id

        LEFT JOIN operation_master om
            ON rs.operation_id = om.operation_id

        WHERE

            ($1::integer IS NULL OR rm.route_id=$1)

        AND ($2::integer IS NULL OR sm.station_id=$2)

        AND ($3::varchar IS NULL OR ree.event_type=$3)

        AND ($4::date IS NULL OR ree.event_time::date >= $4)

        AND ($5::date IS NULL OR ree.event_time::date <= $5)

        ORDER BY

            ree.event_time DESC;

    `;

    const result = await db.query(sql, values);

    return result.rows;

}

// ==========================================================
// LOAD RUNTIME DATA
// ==========================================================

async function getRuntimeData(routeId) {

    const sql = `

        SELECT

            rm.route_id,

            rs.route_step_id,

            rs.station_id,

            rs.machine_id

        FROM route_master rm

        LEFT JOIN route_step rs

            ON rm.route_id = rs.route_id

        WHERE

            rm.route_id = $1

        ORDER BY

            rs.sequence_no

        LIMIT 1;

    `;

    const result = await db.query(sql, [routeId]);

    return result.rows[0];

}

// ==========================================================
// EXECUTE
// ==========================================================

async function execute(payload) {

    const result = await db.query(

        query.INSERT_RUNTIME,

        [

            payload.route_id,

            payload.route_step_id,

            payload.station_id,

            payload.machine_id,

            payload.event_type,

            payload.remarks,

            payload.created_by

        ]

    );

    return result.rows[0];

}

// ==========================================================
// REPORT
// ==========================================================

async function getReport(filters = {}) {

    const values = [

        filters.part_id || null,

        filters.station_id || null,

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

    return getReport(filters);

}

// ==========================================================
// DUPLICATE CHECKS
// ==========================================================

async function checkDuplicateRouteCode(routeCode) {

    const result = await db.query(

        query.CHECK_DUPLICATE_ROUTE_CODE,

        [routeCode]

    );

    return result.rows[0];

}

async function checkDuplicateRouteName(routeName) {

    const result = await db.query(

        query.CHECK_DUPLICATE_ROUTE_NAME,

        [routeName]

    );

    return result.rows[0];

}

async function checkDuplicateRouteCodeForUpdate(routeCode, id) {

    const result = await db.query(

        query.CHECK_DUPLICATE_ROUTE_CODE_FOR_UPDATE,

        [

            routeCode,

            id

        ]

    );

    return result.rows[0];

}

async function checkDuplicateRouteNameForUpdate(routeName, id) {

    const result = await db.query(

        query.CHECK_DUPLICATE_ROUTE_NAME_FOR_UPDATE,

        [

            routeName,

            id

        ]

    );

    return result.rows[0];

}

// ==========================================================
// FK VALIDATION
// ==========================================================

async function checkPart(partId) {

    const result = await db.query(

        `

        SELECT

            part_id,

            part_name

        FROM part_master

        WHERE part_id=$1

        `,

        [partId]

    );

    return result.rows[0];

}

async function checkStation(stationId) {

    const result = await db.query(

        `

        SELECT

            station_id,

            station_name

        FROM station_master

        WHERE station_id=$1

        `,

        [stationId]

    );

    return result.rows[0];

}

async function checkMachine(machineId) {

    const result = await db.query(

        `

        SELECT

            machine_id,

            machine_name

        FROM machine_master

        WHERE machine_id=$1

        `,

        [machineId]

    );

    return result.rows[0];

}

async function checkOperation(operationId) {

    const result = await db.query(

        `

        SELECT

            operation_id,

            operation_name

        FROM operation_master

        WHERE operation_id=$1

        `,

        [operationId]

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

    // Master

    getMaster,

    getMasterById,

    createMaster,

    updateMaster,

    deleteMaster,

    // Runtime

    getRuntime,

    getRuntimeData,

    execute,

    // Report

    getReport,

    exportData,

    // Duplicate Checks

    checkDuplicateRouteCode,

    checkDuplicateRouteName,

    checkDuplicateRouteCodeForUpdate,

    checkDuplicateRouteNameForUpdate,

    // FK Validation

    checkPart,

    checkStation,

    checkMachine,

    checkOperation

};