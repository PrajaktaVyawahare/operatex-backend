// src/modules/skill-matrix/skill.validation.js

// ==========================================================
// CREATE MASTER
// ==========================================================

function validateCreateMaster(payload) {

    const errors = [];

    if (!payload.skill_code)
        errors.push("skill_code required");

    if (!payload.skill_name)
        errors.push("skill_name required");

    if (
        payload.skill_name &&
        payload.skill_name.trim().length < 3
    ) {

        errors.push(
            "skill_name minimum 3 characters"
        );

    }

    if (

        payload.status &&

        ![
            "ACTIVE",
            "INACTIVE"
        ].includes(payload.status)

    ) {

        errors.push(
            "Invalid status"
        );

    }

    return errors;

}

// ==========================================================
// UPDATE MASTER
// ==========================================================

function validateUpdateMaster(payload) {

    const errors = [];

    if (

        payload.skill_name &&

        payload.skill_name.trim().length < 3

    ) {

        errors.push(
            "skill_name minimum 3 characters"
        );

    }

    if (

        payload.status &&

        ![
            "ACTIVE",
            "INACTIVE"
        ].includes(payload.status)

    ) {

        errors.push(
            "Invalid status"
        );

    }

    return errors;

}

// ==========================================================
// CREATE CONFIG
// ==========================================================

function validateCreateConfig(payload) {

    const errors = [];

    if (!payload.config_type) {

        errors.push(
            "config_type required"
        );

        return errors;

    }

    const types = [

        "LEVEL",

        "CERTIFICATION"

    ];

    if (

        !types.includes(
            payload.config_type.toUpperCase()
        )

    ) {

        errors.push(
            "Invalid config_type"
        );

        return errors;

    }

    switch (
        payload.config_type.toUpperCase()
    ) {

        // ==========================================
        // LEVEL
        // ==========================================

        case "LEVEL":

            if (!payload.skill_id)
                errors.push("skill_id required");

            if (!payload.skill_level)
                errors.push("skill_level required");

            if (payload.minimum_score == null)
                errors.push("minimum_score required");

            if (payload.maximum_score == null)
                errors.push("maximum_score required");

            break;

        // ==========================================
        // CERTIFICATION
        // ==========================================

        case "CERTIFICATION":

            if (!payload.skill_id)
                errors.push("skill_id required");

            if (!payload.user_id)
                errors.push("user_id required");

            if (!payload.certificate_no)
                errors.push("certificate_no required");

            if (!payload.issue_date)
                errors.push("issue_date required");

            break;

    }

    return errors;

}

// ==========================================================
// UPDATE CONFIG
// ==========================================================

function validateUpdateConfig(payload) {

    const errors = [];

    if (

        payload.config_type &&

        ![
            "LEVEL",
            "CERTIFICATION"
        ].includes(
            payload.config_type.toUpperCase()
        )

    ) {

        errors.push(
            "Invalid config_type"
        );

    }

    return errors;

}

// ==========================================================
// EXECUTE
// ==========================================================

function validateExecute(payload) {

    const errors = [];

    if (!payload.event_type) {

        errors.push(
            "event_type required"
        );

        return errors;

    }

    if (

        payload.event_type.toUpperCase() !== "VALIDATION"

    ) {

        errors.push(
            "Invalid event_type"
        );

        return errors;

    }

    if (!payload.skill_id)
        errors.push("skill_id required");

    if (!payload.user_id)
        errors.push("user_id required");

    if (!payload.validated_by)
        errors.push("validated_by required");

    if (!payload.validation_result)
        errors.push("validation_result required");

    if (payload.score == null)
        errors.push("score required");

    return errors;

}

// ==========================================================
// REPORT
// ==========================================================

function validateReport(query) {

    const errors = [];

    if (

        query.status &&

        ![
            "ACTIVE",
            "INACTIVE"
        ].includes(query.status)

    ) {

        errors.push(
            "Invalid status"
        );

    }

    return errors;

}

// ==========================================================
// EXPORT
// ==========================================================

function validateExport(payload) {

    const errors = [];

    if (!payload.format)
        errors.push("format required");

    const formats = [

        "CSV",

        "EXCEL",

        "PDF"

    ];

    if (

        payload.format &&

        !formats.includes(
            payload.format.toUpperCase()
        )

    ) {

        errors.push(
            "Invalid export format"
        );

    }

    return errors;

}

// ==========================================================
// EXPORTS
// ==========================================================

module.exports = {

    validateCreateMaster,

    validateUpdateMaster,

    validateCreateConfig,

    validateUpdateConfig,

    validateExecute,

    validateReport,

    validateExport

};