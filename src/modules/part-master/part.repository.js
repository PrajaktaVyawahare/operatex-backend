// src/modules/part-master/part.repository.js

const db = require("../../db/connection");
const query = require("./part.query");

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

        // =====================================
        // PART REVISION
        // =====================================

        case "REVISION": {

            const result = await db.query(

                query.INSERT_REVISION,

                [

                    payload.part_id,

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

        // =====================================
        // ATTRIBUTE CONFIG
        // =====================================

        case "ATTRIBUTE": {

            const result = await db.query(

                query.INSERT_ATTRIBUTE,

                [

                    payload.part_id,

                    payload.attribute_key,

                    payload.attribute_value,

                    payload.display_order,

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

async function updateConfig(
    table,
    id,
    payload
) {

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

        case "REVISION":

            sql = `

                UPDATE part_revision

                SET ${fields.join(", ")}

                WHERE revision_id=$${index}

                RETURNING *;

            `;

            break;

        case "ATTRIBUTE":

            sql = `

                UPDATE part_attribute_config

                SET ${fields.join(", ")}

                WHERE attribute_id=$${index}

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

async function deleteConfig(
    table,
    id
) {

    let sql = "";

    switch (table) {

        case "REVISION":

            sql = query.DELETE_REVISION;

            break;

        case "ATTRIBUTE":

            sql = query.DELETE_ATTRIBUTE;

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

            payload.part_code,

            payload.part_name,

            payload.drawing_no,

            payload.revision_no,

            payload.customer,

            payload.product_family,

            payload.material,

            payload.weight_kg,

            payload.length_mm,

            payload.width_mm,

            payload.height_mm,

            payload.max_production_per_day,

            payload.takt_time,

            payload.status

        ]

    );

    return result.rows[0];

}

// ==========================================================
// UPDATE MASTER
// ==========================================================

async function updateMaster(
    id,
    payload
) {

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

        UPDATE part_master

        SET

            ${fields.join(", ")}

        WHERE

            part_id=$${index}

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

        filters.part_id || null,

        filters.event_type || null,

        filters.from_date || null,

        filters.to_date || null

    ];

    const result = await db.query(

        query.GET_RUNTIME,

        values

    );

    return result.rows;

}

// ==========================================================
// RUNTIME DATA
// ==========================================================

async function getRuntimeData(partId) {

    const result = await db.query(

        `
        SELECT

            pm.part_id,

            pr.revision_id,

            pr.revision_no

        FROM part_master pm

        LEFT JOIN part_revision pr

            ON pm.part_id = pr.part_id

        AND pr.is_current = TRUE

        AND pr.status='ACTIVE'

        WHERE

            pm.part_id = $1
        `,

        [partId]

    );

    return result.rows[0];

}

// ==========================================================
// EXECUTE
// ==========================================================

async function execute(payload) {

    const result = await db.query(

        query.INSERT_EVENT,

        [

            payload.part_id,

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

        filters.status || null,

        filters.customer || null,

        filters.product_family || null

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

        filters.status || null,

        filters.customer || null,

        filters.product_family || null

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

async function checkDuplicatePartCode(partCode) {

    const result = await db.query(

        query.CHECK_DUPLICATE_PART_CODE,

        [partCode]

    );

    return result.rows[0];

}

async function checkDuplicatePartName(partName) {

    const result = await db.query(

        query.CHECK_DUPLICATE_PART_NAME,

        [partName]

    );

    return result.rows[0];

}

async function checkDuplicatePartCodeForUpdate(partCode, id) {

    const result = await db.query(

        query.CHECK_DUPLICATE_PART_CODE_FOR_UPDATE,

        [

            partCode,

            id

        ]

    );

    return result.rows[0];

}

async function checkDuplicatePartNameForUpdate(partName, id) {

    const result = await db.query(

        query.CHECK_DUPLICATE_PART_NAME_FOR_UPDATE,

        [

            partName,

            id

        ]

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

    // Validation

    checkDuplicatePartCode,

    checkDuplicatePartName,

    checkDuplicatePartCodeForUpdate,

    checkDuplicatePartNameForUpdate

};