function validateLine(payload) {

    const errors = [];

    if (!payload.plant_id) {
        errors.push("plant_id required");
    }

    if (!payload.shop_id) {
        errors.push("shop_id required");
    }

    if (!payload.line_code) {
        errors.push("line_code required");
    }

    if (!payload.line_name) {
        errors.push("line_name required");
    }

    if (!payload.line_type) {
        errors.push("line_type required");
    }

    if (!payload.process_type) {
        errors.push("process_type required");
    }

    const codeRegex = /^[A-Z0-9_]{3,30}$/;

    if (
        payload.line_code &&
        !codeRegex.test(payload.line_code)
    ) {
        errors.push("Invalid line_code");
    }

    if (
        payload.line_name &&
        payload.line_name.trim().length < 3
    ) {
        errors.push(
            "line_name minimum 3 characters"
        );
    }

    if (
        payload.target_output !== undefined &&
        (
            isNaN(payload.target_output) ||
            Number(payload.target_output) < 0 ||
            Number(payload.target_output) > 100
        )
    ) {
        errors.push(
            "target_output must be between 0 and 100"
        );
    }

    if (
        payload.takt_time_sec !== undefined &&
        (
            isNaN(payload.takt_time_sec) ||
            Number(payload.takt_time_sec) < 0
        )
    ) {
        errors.push(
            "Invalid takt_time_sec"
        );
    }

    if (
        payload.cycle_time_sec !== undefined &&
        (
            isNaN(payload.cycle_time_sec) ||
            Number(payload.cycle_time_sec) < 0
        )
    ) {
        errors.push(
            "Invalid cycle_time_sec"
        );
    }

    const allowedStatus = [
        "ACTIVE",
        "INACTIVE",
        "SUSPENDED"
    ];

    if (
        payload.status &&
        !allowedStatus.includes(payload.status)
    ) {
        errors.push("Invalid status");
    }

    return errors;
}

function validateExecute(payload) {

    const errors = [];

    if (!payload.action) {
        errors.push("action required");
    }

    const actions = [
        "START",
        "STOP",
        "RESET",
        "SYNC",
        "ENABLE",
        "DISABLE"
    ];

    if (
        payload.action &&
        !actions.includes(payload.action)
    ) {
        errors.push("Invalid action");
    }

    return errors;
}

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
        errors.push("Invalid status");
    }

    return errors;
}

function validateExport(payload) {

    const errors = [];

    if (!payload.format) {
        errors.push("format required");
    }

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

module.exports = {

    validateLine,

    validateExecute,

    validateReport,

    validateExport

};