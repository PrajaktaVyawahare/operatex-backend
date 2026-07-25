// src/modules/part-master/part.validation.js

// ==========================================================
// CREATE MASTER
// ==========================================================

function validateCreateMaster(payload) {

    const errors = [];

    if (!payload.part_code)
        errors.push("part_code required");

    if (!payload.part_name)
        errors.push("part_name required");

    if (
        payload.part_code &&
        payload.part_code.trim().length < 3
    ) {
        errors.push(
            "part_code minimum 3 characters"
        );
    }

    if (
        payload.part_name &&
        payload.part_name.trim().length < 3
    ) {
        errors.push(
            "part_name minimum 3 characters"
        );
    }

    if (
        payload.takt_time !== undefined &&
        (
            isNaN(payload.takt_time) ||
            Number(payload.takt_time) <= 0
        )
    ) {
        errors.push(
            "Invalid takt_time"
        );
    }

    if (
        payload.weight_kg !== undefined &&
        (
            isNaN(payload.weight_kg) ||
            Number(payload.weight_kg) < 0
        )
    ) {
        errors.push(
            "Invalid weight_kg"
        );
    }

    if (
        payload.max_production_per_day !== undefined &&
        (
            isNaN(payload.max_production_per_day) ||
            Number(payload.max_production_per_day) < 0
        )
    ) {
        errors.push(
            "Invalid max_production_per_day"
        );
    }

    if (
        payload.status &&
        ![
            "ACTIVE",
            "INACTIVE",
            "OBSOLETE",
            "SUSPENDED"
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
        payload.part_code !== undefined &&
        payload.part_code.trim().length < 3
    ) {
        errors.push(
            "part_code minimum 3 characters"
        );
    }

    if (
        payload.part_name !== undefined &&
        payload.part_name.trim().length < 3
    ) {
        errors.push(
            "part_name minimum 3 characters"
        );
    }

    if (
        payload.takt_time !== undefined &&
        (
            isNaN(payload.takt_time) ||
            Number(payload.takt_time) <= 0
        )
    ) {
        errors.push(
            "Invalid takt_time"
        );
    }

    if (
        payload.weight_kg !== undefined &&
        (
            isNaN(payload.weight_kg) ||
            Number(payload.weight_kg) < 0
        )
    ) {
        errors.push(
            "Invalid weight_kg"
        );
    }

    if (
        payload.max_production_per_day !== undefined &&
        (
            isNaN(payload.max_production_per_day) ||
            Number(payload.max_production_per_day) < 0
        )
    ) {
        errors.push(
            "Invalid max_production_per_day"
        );
    }

    if (
        payload.status &&
        ![
            "ACTIVE",
            "INACTIVE",
            "OBSOLETE",
            "SUSPENDED"
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

        errors.push("config_type required");

        return errors;

    }

    const types = [

        "REVISION",

        "ATTRIBUTE"

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

        case "REVISION":

            if (!payload.part_id)
                errors.push("part_id required");

            if (!payload.revision_no)
                errors.push("revision_no required");

            if (!payload.effective_from)
                errors.push("effective_from required");

            if (
                payload.effective_to &&
                payload.effective_from >
                payload.effective_to
            ) {

                errors.push(
                    "Invalid effective date"
                );

            }

            break;

        case "ATTRIBUTE":

            if (!payload.part_id)
                errors.push("part_id required");

            if (!payload.attribute_key)
                errors.push("attribute_key required");

            if (!payload.attribute_value)
                errors.push("attribute_value required");

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
        payload.effective_from &&
        payload.effective_to &&
        payload.effective_from >
        payload.effective_to
    ) {

        errors.push(
            "Invalid effective date"
        );

    }

    if (
        payload.attribute_key !== undefined &&
        payload.attribute_key.trim().length < 2
    ) {

        errors.push(
            "attribute_key minimum 2 characters"
        );

    }

    if (
        payload.attribute_value !== undefined &&
        payload.attribute_value.trim().length < 1
    ) {

        errors.push(
            "attribute_value required"
        );

    }

    return errors;

}

// ==========================================================
// EXECUTE
// ==========================================================

function validateExecute(payload) {

    const errors = [];

    if (!payload.part_id)
        errors.push("part_id required");

    if (!payload.event_type)
        errors.push("event_type required");

    const events = [

        "CREATE",

        "UPDATE",

        "RELEASE",

        "APPROVE",

        "OBSOLETE"

    ];

    if (
        payload.event_type &&
        !events.includes(
            payload.event_type
        )
    ) {

        errors.push(
            "Invalid event_type"
        );

    }

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
            "INACTIVE",
            "OBSOLETE",
            "SUSPENDED"
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
        errors.push(
            "format required"
        );

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