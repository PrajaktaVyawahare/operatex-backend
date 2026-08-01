// src/modules/skill-matrix/skill.query.js

module.exports = {

    // ==========================================================
    // CONFIG
    // ==========================================================

    GET_CONFIG: `
        SELECT

            sm.skill_id,

            sm.skill_code,

            sm.skill_name,

            sm.department,

            sm.status,

            slc.level_id,

            slc.skill_level,

            slc.minimum_score,

            slc.maximum_score,

            oc.certification_id,

            oc.user_id,

            um.full_name AS user_name,

            oc.certificate_no,

            oc.issue_date,

            oc.expiry_date

        FROM skill_matrix sm

        LEFT JOIN skill_level_config slc
            ON sm.skill_id = slc.skill_id

        LEFT JOIN operator_certification oc
            ON sm.skill_id = oc.skill_id

        LEFT JOIN user_master um
            ON oc.user_id = um.user_id

        ORDER BY
            sm.skill_code;
    `,

    GET_CONFIG_BY_ID: `
        SELECT

            sm.*,

            slc.level_id,

            slc.skill_level,

            slc.minimum_score,

            slc.maximum_score,

            slc.remarks,

            oc.certification_id,

            oc.user_id,

            um.full_name AS user_name,

            oc.certificate_no,

            oc.issue_date,

            oc.expiry_date,

            oc.certified_by,

            oc.remarks AS certification_remarks

        FROM skill_matrix sm

        LEFT JOIN skill_level_config slc
            ON sm.skill_id = slc.skill_id

        LEFT JOIN operator_certification oc
            ON sm.skill_id = oc.skill_id

        LEFT JOIN user_master um
            ON oc.user_id = um.user_id

        WHERE
            sm.skill_id = $1;
    `,
    // ==========================================================
// CONFIG - SKILL LEVEL
// ==========================================================

GET_LEVELS: `
    SELECT
        level_id,
        skill_id,
        skill_level,
        minimum_score,
        maximum_score,
        remarks,
        status,
        created_at,
        updated_at
    FROM skill_level_config
    ORDER BY minimum_score;
`,

// ==========================================================
// CONFIG - VALIDATION
// ==========================================================

GET_VALIDATIONS: `
    SELECT
        validation_id,
        skill_id,
        user_id,
        validated_by,
        validation_result,
        score,
        remarks,
        event_ts,
        created_at
    FROM skill_validation_event
    ORDER BY event_ts DESC;
`,

    // ==========================================================
    // MASTER
    // ==========================================================

    GET_MASTER: `
        SELECT

            skill_id,

            skill_code,

            skill_name,

            department,

            process_id,

            operation_id,

            description,

            status

        FROM skill_matrix

        WHERE
            status <> 'INACTIVE'

        ORDER BY
            skill_code;
    `,

    GET_MASTER_BY_ID: `
        SELECT *

        FROM skill_matrix

        WHERE
            skill_id = $1;
    `,

    INSERT_MASTER: `
        INSERT INTO skill_matrix
        (
            skill_code,
            skill_name,
            department,
            process_id,
            operation_id,
            description,
            status
        )
        VALUES
        (
            $1,$2,$3,$4,$5,$6,$7
        )
        RETURNING *;
    `,

    CHECK_DUPLICATE_SKILL_CODE: `
        SELECT

            skill_id

        FROM skill_matrix

        WHERE
            skill_code = $1

        LIMIT 1;
    `,

    CHECK_DUPLICATE_SKILL_NAME: `
        SELECT

            skill_id

        FROM skill_matrix

        WHERE
            LOWER(skill_name)=LOWER($1)

        LIMIT 1;
    `,

    CHECK_DUPLICATE_SKILL_CODE_FOR_UPDATE: `
        SELECT

            skill_id

        FROM skill_matrix

        WHERE
            skill_code=$1

        AND
            skill_id<>$2

        LIMIT 1;
    `,

    CHECK_DUPLICATE_SKILL_NAME_FOR_UPDATE: `
        SELECT

            skill_id

        FROM skill_matrix

        WHERE
            LOWER(skill_name)=LOWER($1)

        AND
            skill_id<>$2

        LIMIT 1;
    `,

    UPDATE_MASTER: `
        -- Dynamic SQL generated in repository
    `,

    DELETE_MASTER: `
        UPDATE skill_matrix

        SET

            status='INACTIVE',

            updated_at=NOW()

        WHERE

            skill_id=$1

        RETURNING *;
    `,
        // ==========================================================
    // CONFIG
    // ==========================================================

    INSERT_SKILL_LEVEL: `
        INSERT INTO skill_level_config
        (
            skill_id,
            skill_level,
            minimum_score,
            maximum_score,
            remarks,
            status
        )
        VALUES
        (
            $1,$2,$3,$4,$5,$6
        )
        RETURNING *;
    `,

    INSERT_OPERATOR_CERTIFICATION: `
        INSERT INTO operator_certification
        (
            skill_id,
            user_id,
            certificate_no,
            issue_date,
            expiry_date,
            certified_by,
            remarks,
            status
        )
        VALUES
        (
            $1,$2,$3,$4,$5,$6,$7,$8
        )
        RETURNING *;
    `,

    // ==========================================================
    // RUNTIME
    // ==========================================================

    GET_RUNTIME: `
        SELECT

            sm.skill_id,

            sm.skill_code,

            sm.skill_name,

            slc.skill_level,

            oc.certificate_no,

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

        ORDER BY

            sve.event_ts DESC NULLS LAST;
    `,

    INSERT_SKILL_VALIDATION: `
        INSERT INTO skill_validation_event
        (
            skill_id,
            user_id,
            validated_by,
            validation_result,
            score,
            remarks
        )
        VALUES
        (
            $1,$2,$3,$4,$5,$6
        )
        RETURNING *;
    `,

    // ==========================================================
    // REPORT
    // ==========================================================

    GET_REPORT: `
        SELECT

            sm.skill_id,

            sm.skill_code,

            sm.skill_name,

            sm.department,

            slc.skill_level,

            slc.minimum_score,

            slc.maximum_score,

            um.username AS certified_user,

            oc.certificate_no,

            oc.expiry_date,

            sve.validation_result,

            sve.score,

            sve.event_ts,

            sm.status

        FROM skill_matrix sm

        LEFT JOIN skill_level_config slc
            ON sm.skill_id = slc.skill_id

        LEFT JOIN operator_certification oc
            ON sm.skill_id = oc.skill_id

        LEFT JOIN user_master um
            ON oc.user_id = um.user_id

        LEFT JOIN skill_validation_event sve
            ON sm.skill_id = sve.skill_id

        WHERE

            ($1::varchar IS NULL OR sm.status = $1)

        ORDER BY

            sm.skill_code;
    `

};