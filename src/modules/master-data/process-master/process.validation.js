// src/modules/process-master/process.validation.js

// ==========================================================
// CREATE MASTER
// ==========================================================

function validateCreateMaster(payload) {

    const errors = [];

    if (!payload.process_code)
        errors.push("process_code required");

    if (!payload.process_name)
        errors.push("process_name required");

    if (!payload.part_id)
        errors.push("part_id required");

    if (!payload.machine_id)
        errors.push("machine_id required");

    if (!payload.operation_id)
        errors.push("operation_id required");

    if (!payload.sequence_no)
        errors.push("sequence_no required");

    if (!payload.cycle_time)
        errors.push("cycle_time required");

    if (
        payload.process_code &&
        payload.process_code.trim().length < 3
    ) {

        errors.push(
            "process_code minimum 3 characters"
        );

    }

    if (
        payload.process_name &&
        payload.process_name.trim().length < 3
    ) {

        errors.push(
            "process_name minimum 3 characters"
        );

    }

    if (
        payload.sequence_no &&
        (
            isNaN(payload.sequence_no) ||
            Number(payload.sequence_no) <= 0
        )
    ) {

        errors.push(
            "Invalid sequence_no"
        );

    }

    if (
        payload.cycle_time &&
        (
            isNaN(payload.cycle_time) ||
            Number(payload.cycle_time) <= 0
        )
    ) {

        errors.push(
            "Invalid cycle_time"
        );

    }

    if (
        payload.setup_time !== undefined &&
        (
            isNaN(payload.setup_time) ||
            Number(payload.setup_time) < 0
        )
    ) {

        errors.push(
            "Invalid setup_time"
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
        payload.process_code !== undefined &&
        payload.process_code.trim().length < 3
    ) {

        errors.push(
            "process_code minimum 3 characters"
        );

    }

    if (
        payload.process_name !== undefined &&
        payload.process_name.trim().length < 3
    ) {

        errors.push(
            "process_name minimum 3 characters"
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

    if (
        payload.cycle_time !== undefined &&
        (
            isNaN(payload.cycle_time) ||
            Number(payload.cycle_time) <= 0
        )
    ) {

        errors.push(
            "Invalid cycle_time"
        );

    }

    if (
        payload.setup_time !== undefined &&
        (
            isNaN(payload.setup_time) ||
            Number(payload.setup_time) < 0
        )
    ) {

        errors.push(
            "Invalid setup_time"
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

        "OPERATION",

        "REVISION"

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

    switch (payload.config_type.toUpperCase()) {

        // ==========================================
        // OPERATION
        // ==========================================

        case "OPERATION":

            if (!payload.operation_code)
                errors.push("operation_code required");

            if (!payload.operation_name)
                errors.push("operation_name required");

            if (!payload.operation_type)
                errors.push("operation_type required");

            break;

        // ==========================================
        // REVISION
        // ==========================================

        case "REVISION":

            if (!payload.process_id)
                errors.push("process_id required");

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
        payload.operation_code !== undefined &&
        payload.operation_code.trim().length < 2
    ) {

        errors.push(
            "operation_code minimum 2 characters"
        );

    }

    if (
        payload.operation_name !== undefined &&
        payload.operation_name.trim().length < 3
    ) {

        errors.push(
            "operation_name minimum 3 characters"
        );

    }

    return errors;

}

// ==========================================================
// EXECUTE
// ==========================================================

function validateExecute(payload) {

    const errors = [];

    if (!payload.process_id)
        errors.push("process_id required");

    if (!payload.event_type)
        errors.push("event_type required");

    const events = [

        "START",

        "STOP",

        "PAUSE",

        "RESUME",

        "COMPLETE",

        "UPDATE"

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

    if (
        query.from_date &&
        query.to_date &&
        query.from_date >
        query.to_date
    ) {

        errors.push(
            "Invalid date range"
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