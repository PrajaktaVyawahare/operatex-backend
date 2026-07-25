// src/modules/gauge-instrument-master/gauge.validation.js

// ==========================================================
// CREATE MASTER
// ==========================================================

function validateCreateMaster(payload) {

    const errors = [];

    if (!payload.gauge_no)
        errors.push("gauge_no required");

    if (!payload.gauge_name)
        errors.push("gauge_name required");

    if (!payload.gauge_type)
        errors.push("gauge_type required");

    if (
        payload.range_min !== undefined &&
        isNaN(payload.range_min)
    ) {
        errors.push(
            "Invalid range_min"
        );
    }

    if (
        payload.range_max !== undefined &&
        isNaN(payload.range_max)
    ) {
        errors.push(
            "Invalid range_max"
        );
    }

    if (
        payload.accuracy !== undefined &&
        (
            isNaN(payload.accuracy) ||
            Number(payload.accuracy) <= 0
        )
    ) {
        errors.push(
            "Invalid accuracy"
        );
    }

    if (
        payload.gauge_name &&
        payload.gauge_name.trim().length < 3
    ) {
        errors.push(
            "gauge_name minimum 3 characters"
        );
    }

    if (
        payload.status &&
        ![
            "ACTIVE",
            "INACTIVE",
            "UNDER_CALIBRATION"
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
        payload.range_min !== undefined &&
        isNaN(payload.range_min)
    ) {
        errors.push(
            "Invalid range_min"
        );
    }

    if (
        payload.range_max !== undefined &&
        isNaN(payload.range_max)
    ) {
        errors.push(
            "Invalid range_max"
        );
    }

    if (
        payload.accuracy !== undefined &&
        (
            isNaN(payload.accuracy) ||
            Number(payload.accuracy) <= 0
        )
    ) {
        errors.push(
            "Invalid accuracy"
        );
    }

    if (
        payload.gauge_name &&
        payload.gauge_name.trim().length < 3
    ) {
        errors.push(
            "gauge_name minimum 3 characters"
        );
    }

    if (
        payload.status &&
        ![
            "ACTIVE",
            "INACTIVE",
            "UNDER_CALIBRATION"
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

        "PARAMETER",

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
        // PARAMETER
        // ==========================================

        case "PARAMETER":

            if (!payload.gauge_id)
                errors.push("gauge_id required");

            if (!payload.parameter_name)
                errors.push("parameter_name required");

            if (payload.lsl === undefined)
                errors.push("lsl required");

            if (payload.usl === undefined)
                errors.push("usl required");

            if (!payload.unit)
                errors.push("unit required");

            break;

        // ==========================================
        // CALIBRATION
        // ==========================================

        case "CALIBRATION":

            if (!payload.asset_id)
                errors.push("asset_id required");

            if (!payload.asset_type)
                errors.push("asset_type required");

            if (!payload.due_date)
                errors.push("due_date required");

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
            "PARAMETER",
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

    if (
        !payload.event_type
    ) {

        errors.push(
            "event_type required"
        );

        return errors;

    }

    const events = [

        "GAUGE",

        "CALIBRATION"

    ];

    if (
        !events.includes(
            payload.event_type.toUpperCase()
        )
    ) {

        errors.push(
            "Invalid event_type"
        );

        return errors;

    }

    switch (
        payload.event_type.toUpperCase()
    ) {

        // ==========================================
        // GAUGE LOG
        // ==========================================

        case "GAUGE":

            if (!payload.gauge_id)
                errors.push("gauge_id required");

            if (!payload.parameter_name)
                errors.push("parameter_name required");

            if (payload.measured_value === undefined)
                errors.push("measured_value required");

            if (!payload.result)
                errors.push("result required");

            break;

        // ==========================================
        // CALIBRATION
        // ==========================================

        case "CALIBRATION":

            if (!payload.asset_id)
                errors.push("asset_id required");

            if (!payload.result)
                errors.push("result required");

            if (!payload.calibrated_by)
                errors.push("calibrated_by required");

            break;

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
            "UNDER_CALIBRATION"
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