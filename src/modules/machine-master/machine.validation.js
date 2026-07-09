// src/modules/machine-master/machine.validation.js

function validateMachine(payload) {

    const errors = [];

    if (!payload.machine_name)
        errors.push("machine_name required");

    if (!payload.make_model)
        errors.push("make_model required");

    if (!payload.controller_make_model)
        errors.push("controller_make_model required");

    if (!payload.installed_date)
        errors.push("installed_date required");

    if (!payload.location)
        errors.push("location required");

    if (!payload.communication_protocol)
        errors.push("communication_protocol required");

    if (
        payload.tool_count !== undefined &&
        (
            isNaN(payload.tool_count) ||
            Number(payload.tool_count) < 0
        )
    ) {
        errors.push("Invalid tool_count");
    }

    if (
        !payload.power_rating ||
        isNaN(payload.power_rating) ||
        Number(payload.power_rating) <= 0
    ) {
        errors.push("Invalid power_rating");
    }

    if (
        payload.no_of_spindels === undefined ||
        isNaN(payload.no_of_spindels)
    ) {
        errors.push("Invalid no_of_spindels");
    }

    if (
        payload.no_of_servo === undefined ||
        isNaN(payload.no_of_servo)
    ) {
        errors.push("Invalid no_of_servo");
    }

    if (
        payload.no_of_encoder === undefined ||
        isNaN(payload.no_of_encoder)
    ) {
        errors.push("Invalid no_of_encoder");
    }

    if (
        payload.no_of_batteries === undefined ||
        isNaN(payload.no_of_batteries)
    ) {
        errors.push("Invalid no_of_batteries");
    }

    const status = [
        "ACTIVE",
        "INACTIVE",
        "MAINTENANCE",
        "BREAKDOWN"
    ];

    if (
        payload.status &&
        !status.includes(payload.status)
    ) {
        errors.push("Invalid status");
    }

    if (
        payload.bottleneck &&
        ![
            "YES",
            "NO"
        ].includes(payload.bottleneck)
    ) {
        errors.push("Invalid bottleneck");
    }

    return errors;

}

// =======================================================

function validateExecute(payload) {

    const errors = [];

    if (!payload.machine_id)
        errors.push("machine_id required");

    if (!payload.status)
        errors.push("status required");

    const allowedStatus = [

        "RUNNING",

        "IDLE",

        "STOPPED",

        "BREAKDOWN",

        "MAINTENANCE",

        "OFFLINE",

        "SETUP"

    ];

    if (
        payload.status &&
        !allowedStatus.includes(payload.status)
    ) {
        errors.push("Invalid status");
    }

    return errors;

}

// =======================================================

function validateReport(query) {

    const errors = [];

    if (
        query.status &&
        ![
            "ACTIVE",
            "INACTIVE",
            "MAINTENANCE",
            "BREAKDOWN"
        ].includes(query.status)
    ) {
        errors.push("Invalid status");
    }

    return errors;

}

// =======================================================

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
        errors.push("Invalid export format");
    }

    return errors;

}

module.exports = {

    validateMachine,

    validateExecute,

    validateReport,

    validateExport

};