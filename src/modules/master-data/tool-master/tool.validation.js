// src/modules/tool-master/tool.validation.js

// ==========================================================
// CREATE MASTER
// ==========================================================

function validateCreateMaster(payload) {

    const errors = [];

    if (!payload.machine_id)
        errors.push("machine_id required");

    if (!payload.tool_no)
        errors.push("tool_no required");

    if (!payload.tool_name)
        errors.push("tool_name required");

    if (!payload.life_limit)
        errors.push("life_limit required");

    if (
        payload.life_limit &&
        (
            isNaN(payload.life_limit) ||
            Number(payload.life_limit) <= 0
        )
    ) {
        errors.push(
            "Invalid life_limit"
        );
    }

    if (
        payload.current_usage &&
        (
            isNaN(payload.current_usage) ||
            Number(payload.current_usage) < 0
        )
    ) {
        errors.push(
            "Invalid current_usage"
        );
    }

    if (
        payload.warning_threshold &&
        (
            isNaN(payload.warning_threshold) ||
            Number(payload.warning_threshold) < 0 ||
            Number(payload.warning_threshold) > 100
        )
    ) {
        errors.push(
            "Invalid warning_threshold"
        );
    }

    if (
        payload.critical_threshold &&
        (
            isNaN(payload.critical_threshold) ||
            Number(payload.critical_threshold) < 0 ||
            Number(payload.critical_threshold) > 100
        )
    ) {
        errors.push(
            "Invalid critical_threshold"
        );
    }

    if (
        payload.tool_name &&
        payload.tool_name.trim().length < 3
    ) {
        errors.push(
            "tool_name minimum 3 characters"
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

    return errors;

}

// ==========================================================
// UPDATE MASTER
// ==========================================================

function validateUpdateMaster(payload) {

    const errors = [];

    if (
        payload.life_limit !== undefined &&
        (
            isNaN(payload.life_limit) ||
            Number(payload.life_limit) <= 0
        )
    ) {
        errors.push(
            "Invalid life_limit"
        );
    }

    if (
        payload.current_usage !== undefined &&
        (
            isNaN(payload.current_usage) ||
            Number(payload.current_usage) < 0
        )
    ) {
        errors.push(
            "Invalid current_usage"
        );
    }

    if (
        payload.warning_threshold !== undefined &&
        (
            isNaN(payload.warning_threshold) ||
            Number(payload.warning_threshold) < 0 ||
            Number(payload.warning_threshold) > 100
        )
    ) {
        errors.push(
            "Invalid warning_threshold"
        );
    }

    if (
        payload.critical_threshold !== undefined &&
        (
            isNaN(payload.critical_threshold) ||
            Number(payload.critical_threshold) < 0 ||
            Number(payload.critical_threshold) > 100
        )
    ) {
        errors.push(
            "Invalid critical_threshold"
        );
    }

    if (
        payload.tool_name !== undefined &&
        payload.tool_name.trim().length < 3
    ) {
        errors.push(
            "tool_name minimum 3 characters"
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

        "LIFE",

        "CALIBRATION"

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
        // LIFE CONFIG
        // ==========================================

        case "LIFE":

            if (!payload.tool_id)
                errors.push("tool_id required");

            if (!payload.life_source)
                errors.push("life_source required");

            if (
                payload.warning_percent === undefined
            )
                errors.push("warning_percent required");

            break;

        // ==========================================
        // CALIBRATION CONFIG
        // ==========================================

        case "CALIBRATION":

            if (!payload.tool_id)
                errors.push("tool_id required");

            if (!payload.calibration_type)
                errors.push("calibration_type required");

            if (
                payload.calibration_interval === undefined
            )
                errors.push(
                    "calibration_interval required"
                );

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
            "LIFE",
            "CALIBRATION"
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

    if (!payload.tool_id)
        errors.push("tool_id required");

    if (!payload.event_type)
        errors.push("event_type required");

    const events = [

        "USAGE",

        "REPLACEMENT",

        "OFFSET"

    ];

    if (
        payload.event_type &&
        !events.includes(
            payload.event_type.toUpperCase()
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