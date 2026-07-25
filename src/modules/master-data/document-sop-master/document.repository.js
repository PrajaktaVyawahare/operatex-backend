// src/modules/document-sop-master/document.repository.js

const db = require("../../../db/connection");
const query = require("./document.query");

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

        // ==========================================
        // REVISION
        // ==========================================

        case "REVISION": {

            const result = await db.query(

                query.INSERT_DOCUMENT_REVISION,

                [

                    payload.document_id,

                    payload.revision_no,

                    payload.effective_from,

                    payload.effective_to,

                    payload.change_description,

                    payload.approved_by,

                    payload.status || "ACTIVE"

                ]

            );

            return result.rows[0];

        }

        // ==========================================
        // ACCESS
        // ==========================================

        case "ACCESS": {

            const result = await db.query(

                query.INSERT_DOCUMENT_ACCESS,

                [

                    payload.document_id,

                    payload.role_name,

                    payload.can_view,

                    payload.can_download,

                    payload.can_print,

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

        case "REVISION":

            sql = `

                UPDATE document_revision

                SET

                    ${fields.join(", ")}

                WHERE

                    revision_id=$${index}

                RETURNING *;

            `;

            break;

        case "ACCESS":

            sql = `

                UPDATE document_access_config

                SET

                    ${fields.join(", ")}

                WHERE

                    access_id=$${index}

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

        case "REVISION":

            sql = `

                UPDATE document_revision

                SET

                    status='INACTIVE',

                    updated_at=NOW()

                WHERE

                    revision_id=$1

                RETURNING *;

            `;

            break;

        case "ACCESS":

            sql = `

                UPDATE document_access_config

                SET

                    status='INACTIVE',

                    updated_at=NOW()

                WHERE

                    access_id=$1

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

            payload.document_no,

            payload.document_name,

            payload.document_type,

            payload.category,

            payload.department,

            payload.file_name,

            payload.file_path,

            payload.description,

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

        UPDATE document_master

        SET

            ${fields.join(", ")}

        WHERE

            document_id=$${index}

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

        filters.document_id || null,

        filters.status || null

    ];

    const sql = `

        SELECT

            dm.document_id,

            dm.document_no,

            dm.document_name,

            dr.revision_no,

            dvl.view_log_id,

            dvl.viewed_by,

            dvl.viewed_from,

            dvl.remarks,

            dvl.event_ts

        FROM document_master dm

        LEFT JOIN document_revision dr

            ON dm.document_id = dr.document_id

        LEFT JOIN document_view_log dvl

            ON dm.document_id = dvl.document_id

        WHERE

            (

                $1::integer IS NULL

                OR dm.document_id = $1

            )

        AND

            (

                $2::varchar IS NULL

                OR dm.status = $2

            )

        ORDER BY

            dvl.event_ts DESC NULLS LAST;

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
        // DOCUMENT VIEW
        // ==========================================

        case "VIEW": {

            const result = await db.query(

                query.INSERT_DOCUMENT_VIEW_LOG,

                [

                    payload.document_id,

                    payload.viewed_by,

                    payload.viewed_from,

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

async function checkDuplicateDocumentNo(documentNo) {

    const result = await db.query(

        query.CHECK_DUPLICATE_DOCUMENT_NO,

        [documentNo]

    );

    return result.rows[0];

}

async function checkDuplicateDocumentName(documentName) {

    const result = await db.query(

        query.CHECK_DUPLICATE_DOCUMENT_NAME,

        [documentName]

    );

    return result.rows[0];

}

async function checkDuplicateDocumentNoForUpdate(documentNo, id) {

    const result = await db.query(

        query.CHECK_DUPLICATE_DOCUMENT_NO_FOR_UPDATE,

        [

            documentNo,

            id

        ]

    );

    return result.rows[0];

}

async function checkDuplicateDocumentNameForUpdate(documentName, id) {

    const result = await db.query(

        query.CHECK_DUPLICATE_DOCUMENT_NAME_FOR_UPDATE,

        [

            documentName,

            id

        ]

    );

    return result.rows[0];

}

// ==========================================================
// VALIDATION
// ==========================================================

async function checkDocument(documentId) {

    const result = await db.query(

        `

        SELECT

            document_id,

            document_no,

            document_name,

            status

        FROM document_master

        WHERE

            document_id = $1

        `,

        [

            documentId

        ]

    );

    return result.rows[0];

}

// ==========================================================
// EXPORTS
// ==========================================================

module.exports = {

    // ======================================================
    // CONFIG
    // ======================================================

    getConfig,

    getConfigById,

    createConfig,

    updateConfig,

    deleteConfig,

    // ======================================================
    // MASTER
    // ======================================================

    getMaster,

    getMasterById,

    createMaster,

    updateMaster,

    deleteMaster,

    // ======================================================
    // RUNTIME
    // ======================================================

    getRuntime,

    execute,

    // ======================================================
    // REPORT
    // ======================================================

    getReport,

    exportData,

    // ======================================================
    // DUPLICATE CHECKS
    // ======================================================

    checkDuplicateDocumentNo,

    checkDuplicateDocumentName,

    checkDuplicateDocumentNoForUpdate,

    checkDuplicateDocumentNameForUpdate,

    // ======================================================
    // VALIDATION
    // ======================================================

    checkDocument

};