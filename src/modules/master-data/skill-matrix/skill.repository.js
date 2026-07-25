// src/modules/skill-matrix/skill.repository.js

const db = require("../../../db/connection");
const query = require("./skill.query");

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
        // SKILL LEVEL
        // ==========================================

        case "LEVEL": {

            const result = await db.query(

                query.INSERT_SKILL_LEVEL,

                [

                    payload.skill_id,

                    payload.skill_level,

                    payload.minimum_score,

                    payload.maximum_score,

                    payload.remarks,

                    payload.status || "ACTIVE"

                ]

            );

            return result.rows[0];

        }

        // ==========================================
        // OPERATOR CERTIFICATION
        // ==========================================

        case "CERTIFICATION": {

            const result = await db.query(

                query.INSERT_OPERATOR_CERTIFICATION,

                [

                    payload.skill_id,

                    payload.user_id,

                    payload.certificate_no,

                    payload.issue_date,

                    payload.expiry_date,

                    payload.certified_by,

                    payload.remarks,

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

        case "LEVEL":

            sql = `

                UPDATE skill_level_config

                SET

                    ${fields.join(", ")}

                WHERE

                    level_id=$${index}

                RETURNING *;

            `;

            break;

        case "CERTIFICATION":

            sql = `

                UPDATE operator_certification

                SET

                    ${fields.join(", ")}

                WHERE

                    certification_id=$${index}

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

        case "LEVEL":

            sql = `

                UPDATE skill_level_config

                SET

                    status='INACTIVE',

                    updated_at=NOW()

                WHERE

                    level_id=$1

                RETURNING *;

            `;

            break;

        case "CERTIFICATION":

            sql = `

                UPDATE operator_certification

                SET

                    status='INACTIVE',

                    updated_at=NOW()

                WHERE

                    certification_id=$1

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

            payload.skill_code,

            payload.skill_name,

            payload.department,

            payload.process_id,

            payload.operation_id,

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

        UPDATE skill_matrix

        SET

            ${fields.join(", ")}

        WHERE

            skill_id=$${index}

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

        filters.skill_id || null,

        filters.user_id || null,

        filters.validation_result || null

    ];

    const sql = `

        SELECT

            sm.skill_id,

            sm.skill_code,

            sm.skill_name,

            slc.skill_level,

            oc.certification_id,

            oc.certificate_no,

            oc.expiry_date,

            um.full_name AS user_name,

            sve.validation_id,

            sve.validation_result,

            sve.score,

            validator.full_name AS validated_by,

            sve.remarks,

            sve.event_ts

        FROM skill_matrix sm

        LEFT JOIN skill_level_config slc

            ON sm.skill_id = slc.skill_id

        LEFT JOIN operator_certification oc

            ON sm.skill_id = oc.skill_id

        LEFT JOIN user_master um

            ON oc.user_id = um.user_id

        LEFT JOIN skill_validation_event sve

            ON sm.skill_id = sve.skill_id

        LEFT JOIN user_master validator

            ON sve.validated_by = validator.user_id

        WHERE

            (

                $1::integer IS NULL

                OR sm.skill_id = $1

            )

        AND

            (

                $2::integer IS NULL

                OR oc.user_id = $2

            )

        AND

            (

                $3::varchar IS NULL

                OR sve.validation_result = $3

            )

        ORDER BY

            sve.event_ts DESC NULLS LAST;

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

    const result = await db.query(

        query.INSERT_SKILL_VALIDATION,

        [

            payload.skill_id,

            payload.user_id,

            payload.validated_by,

            payload.validation_result,

            payload.score,

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

async function checkDuplicateSkillCode(skillCode) {

    const result = await db.query(

        query.CHECK_DUPLICATE_SKILL_CODE,

        [skillCode]

    );

    return result.rows[0];

}

async function checkDuplicateSkillName(skillName) {

    const result = await db.query(

        query.CHECK_DUPLICATE_SKILL_NAME,

        [skillName]

    );

    return result.rows[0];

}

async function checkDuplicateSkillCodeForUpdate(skillCode, id) {

    const result = await db.query(

        query.CHECK_DUPLICATE_SKILL_CODE_FOR_UPDATE,

        [

            skillCode,

            id

        ]

    );

    return result.rows[0];

}

async function checkDuplicateSkillNameForUpdate(skillName, id) {

    const result = await db.query(

        query.CHECK_DUPLICATE_SKILL_NAME_FOR_UPDATE,

        [

            skillName,

            id

        ]

    );

    return result.rows[0];

}

// ==========================================================
// FK VALIDATION
// ==========================================================

async function checkProcess(processId) {

    const result = await db.query(

        `

        SELECT

            process_id,

            process_name

        FROM process_master

        WHERE

            process_id = $1

        `,

        [

            processId

        ]

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

        WHERE

            operation_id = $1

        `,

        [

            operationId

        ]

    );

    return result.rows[0];

}

async function checkUser(userId) {

    const result = await db.query(
        `
        SELECT

            user_id,

            employee_code,

            username,

            email_id,

            department,

            status

        FROM user_master

        WHERE user_id = $1
        `,
        [userId]
    );

    return result.rows[0];

}

async function checkSkill(skillId) {

    const result = await db.query(

        `

        SELECT

            skill_id,

            skill_code,

            skill_name,

            status

        FROM skill_matrix

        WHERE

            skill_id = $1

        `,

        [

            skillId

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

    checkDuplicateSkillCode,

    checkDuplicateSkillName,

    checkDuplicateSkillCodeForUpdate,

    checkDuplicateSkillNameForUpdate,

    // ======================================================
    // FK VALIDATION
    // ======================================================

    checkProcess,

    checkOperation,

    checkUser,

    checkSkill

};