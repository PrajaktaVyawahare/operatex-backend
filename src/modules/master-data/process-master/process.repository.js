// src/modules/process-master/process.repository.js

const db = require("../../../db/connection");
const query = require("./process.query");

// ==========================================================
// CONFIG
// ==========================================================

async function getConfig() {

    const result = await db.query(
        query.GET_CONFIG
    );

    return result.rows;

}

async function getConfigById(type, id) {

    let sql = "";

    switch (type) {

        case "OPERATION":
            sql = `
                SELECT *
                FROM operation_master
                WHERE operation_id = $1
            `;
            break;

        case "REVISION":
            sql = `
                SELECT *
                FROM process_revision
                WHERE revision_id = $1
            `;
            break;

        default:
            throw new Error("Invalid config type");
    }

    const result = await db.query(sql, [id]);

    return result.rows[0];
}
// ==========================================================
// CONFIG - REVISION
// ==========================================================

async function getRevisions() {

    const result =
        await db.query(
            query.GET_REVISIONS
        );

    return result.rows;

}

// ==========================================================
// CONFIG - OPERATION
// ==========================================================

async function getOperations() {

    const result =
        await db.query(
            query.GET_OPERATIONS
        );

    return result.rows;

}

// ==========================================================
// CREATE CONFIG
// ==========================================================

async function createConfig(payload) {

    switch (payload.config_type.toUpperCase()) {

        case "OPERATION": {

            const result = await db.query(

                query.INSERT_OPERATION,

                [

                    payload.operation_code,

                    payload.operation_name,

                    payload.operation_type,

                    payload.description,

                    payload.status || "ACTIVE"

                ]

            );

            return result.rows[0];

        }

        case "REVISION": {

            const result = await db.query(

                query.INSERT_REVISION,

                [

                    payload.process_id,

                    payload.revision_no,

                    payload.revision_description,

                    payload.effective_from,

                    payload.effective_to,

                    payload.is_current,

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

    switch (table) {

        case "OPERATION":

            sql = `

                UPDATE operation_master

                SET ${fields.join(", ")}

                WHERE operation_id=$${index}

                RETURNING *;

            `;

            break;

        case "REVISION":

            sql = `

                UPDATE process_revision

                SET ${fields.join(", ")}

                WHERE revision_id=$${index}

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

    switch (table) {

        case "OPERATION":

            sql = `

                UPDATE operation_master

                SET

                    status='INACTIVE',

                    updated_at=NOW()

                WHERE operation_id=$1

                RETURNING *;

            `;

            break;

        case "REVISION":

            sql = `

                UPDATE process_revision

                SET

                    status='INACTIVE',

                    updated_at=NOW()

                WHERE revision_id=$1

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

            payload.process_code,

            payload.process_name,

            payload.part_id,

            payload.machine_id,

            payload.operation_id,

            payload.sequence_no,

            payload.cycle_time,

            payload.setup_time,

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
    console.log("UPDATE PAYLOAD");
console.log(payload);

   const allowed = [

    "process_code",
    "process_name",
    "part_id",
    "machine_id",
    "operation_id",
    "sequence_no",
    "cycle_time",
    "setup_time",
    "status"

];

Object.keys(payload)
    .filter(key => allowed.includes(key))
    .forEach((key) => {

        fields.push(`${key}=$${index}`);
        values.push(payload[key]);
        index++;

    });

    fields.push("updated_at=NOW()");

    values.push(id);

    const sql = `

        UPDATE process_master

        SET

            ${fields.join(", ")}

        WHERE

            process_id=$${index}

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

        filters.process_id || null,

        filters.event_type || null,

        filters.from_date || null,

        filters.to_date || null

    ];

    const sql = `

        SELECT

            pe.event_id,

            pm.process_id,

            pm.process_code,

            pm.process_name,

            pt.part_code,

            pt.part_name,

            mm.machine_name,

            om.operation_name,

            pr.revision_no,

            pe.event_type,

            pe.event_time,

            pe.remarks,

            pe.created_by,

            pe.created_at

        FROM process_event pe

        INNER JOIN process_master pm
            ON pe.process_id = pm.process_id

        INNER JOIN part_master pt
            ON pm.part_id = pt.part_id

        INNER JOIN machine_master mm
            ON pm.machine_id = mm.machine_id

        INNER JOIN operation_master om
            ON pm.operation_id = om.operation_id

        LEFT JOIN process_revision pr
            ON pe.revision_id = pr.revision_id

        WHERE

            ($1::integer IS NULL OR pm.process_id = $1)

        AND ($2::varchar IS NULL OR pe.event_type = $2)

        AND ($3::date IS NULL OR pe.event_time::date >= $3)

        AND ($4::date IS NULL OR pe.event_time::date <= $4)

        ORDER BY

            pe.event_time DESC;

    `;

    const result = await db.query(sql, values);

    return result.rows;

}

// ==========================================================
// LOAD RUNTIME DATA
// ==========================================================

async function getRuntimeData(processId) {

    const sql = `

        SELECT

            pm.process_id,

            pm.part_id,

            pm.machine_id,

            pm.operation_id,

            pr.revision_id,

            pr.revision_no

        FROM process_master pm

        LEFT JOIN process_revision pr

            ON pm.process_id = pr.process_id

           AND pr.is_current = TRUE

           AND pr.status='ACTIVE'

        WHERE

            pm.process_id=$1;

    `;

    const result = await db.query(sql, [processId]);

    return result.rows[0];

}

// ==========================================================
// EXECUTE
// ==========================================================

async function execute(payload) {

    const result = await db.query(

        query.INSERT_RUNTIME,

        [

            payload.process_id,

            payload.revision_id,

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

        filters.machine_id || null,

        filters.operation_id || null,

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

async function checkDuplicateProcessCode(processCode) {

    const result = await db.query(

        query.CHECK_DUPLICATE_PROCESS_CODE,

        [processCode]

    );

    return result.rows[0];

}

async function checkDuplicateProcessName(processName) {

    const result = await db.query(

        query.CHECK_DUPLICATE_PROCESS_NAME,

        [processName]

    );

    return result.rows[0];

}

async function checkDuplicateProcessCodeForUpdate(processCode, id) {

    const result = await db.query(

        query.CHECK_DUPLICATE_PROCESS_CODE_FOR_UPDATE,

        [

            processCode,

            id

        ]

    );

    return result.rows[0];

}

async function checkDuplicateProcessNameForUpdate(processName, id) {

    const result = await db.query(

        query.CHECK_DUPLICATE_PROCESS_NAME_FOR_UPDATE,

        [

            processName,

            id

        ]

    );

    return result.rows[0];

}

// ==========================================================
// FK VALIDATIONS
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
    getRevisions,

getOperations,

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

    checkDuplicateProcessCode,

    checkDuplicateProcessName,

    checkDuplicateProcessCodeForUpdate,

    checkDuplicateProcessNameForUpdate,

    // FK Validation

    checkPart,

    checkMachine,

    checkOperation

};