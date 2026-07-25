// src/modules/route-station-master/route.validation.js

// ==========================================================
// CREATE MASTER
// ==========================================================

function validateCreateMaster(payload) {

    const errors = [];

    if (!payload.part_id)
        errors.push("part_id required");

    if (!payload.route_code)
        errors.push("route_code required");

    if (!payload.route_name)
        errors.push("route_name required");

    if (
        payload.route_code &&
        payload.route_code.trim().length < 3
    ) {
        errors.push(
            "route_code minimum 3 characters"
        );
    }

    if (
        payload.route_name &&
        payload.route_name.trim().length < 3
    ) {
        errors.push(
            "route_name minimum 3 characters"
        );
    }

    if (
        payload.status &&
        ![
            "ACTIVE",
            "INACTIVE",
            "SUSPENDED"
        ].includes(payload.status)
    ) {
        errors.push(
            "Invalid status"
        );
    }

    if (
        payload.is_active !== undefined &&
        typeof payload.is_active !== "boolean"
    ) {
        errors.push(
            "is_active must be boolean"
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
        payload.route_code &&
        payload.route_code.trim().length < 3
    ) {
        errors.push(
            "route_code minimum 3 characters"
        );
    }

    if (
        payload.route_name &&
        payload.route_name.trim().length < 3
    ) {
        errors.push(
            "route_name minimum 3 characters"
        );
    }

    if (
        payload.status &&
        ![
            "ACTIVE",
            "INACTIVE",
            "SUSPENDED"
        ].includes(payload.status)
    ) {
        errors.push(
            "Invalid status"
        );
    }

    if (
        payload.is_active !== undefined &&
        typeof payload.is_active !== "boolean"
    ) {
        errors.push(
            "is_active must be boolean"
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

        "STEP",

        "VALIDATION"

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
        // STEP
        // ==========================================

        case "STEP":

            if (!payload.route_id)
                errors.push("route_id required");

            if (!payload.sequence_no)
                errors.push("sequence_no required");

            if (!payload.station_id)
                errors.push("station_id required");

            if (!payload.machine_id)
                errors.push("machine_id required");

            if (!payload.operation_id)
                errors.push("operation_id required");

            break;

        // ==========================================
        // VALIDATION
        // ==========================================

        case "VALIDATION":

            if (!payload.route_step_id)
                errors.push("route_step_id required");

            if (!payload.expression)
                errors.push("expression required");

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
            "STEP",
            "VALIDATION"
        ].includes(
            payload.config_type.toUpperCase()
        )
    ) {

        errors.push(
            "Invalid config_type"
        );

    }

    if (
        payload.sequence_no !== undefined &&
        (
            isNaN(payload.sequence_no) ||
            Number(payload.sequence_no) <= 0
        )
    ) {

        errors.push(
            "Invalid sequence_no"
        );

    }

    return errors;

}

// ==========================================================
// EXECUTE
// ==========================================================

function validateExecute(payload) {

    const errors = [];

    if (!payload.route_id)
        errors.push("route_id required");

    if (!payload.event_type)
        errors.push("event_type required");

    const events = [

        "START",

        "NEXT",

        "COMPLETE",

        "REWORK",

        "REJECT",

        "STOP"

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