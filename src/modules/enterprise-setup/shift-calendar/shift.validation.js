// src/modules/shift-calendar/shift.validation.js

// ==========================================================
// CREATE MASTER
// ==========================================================

function validateCreateMaster(payload) {

    const errors = [];

    if (!payload.shift_no)
        errors.push("shift_no required");

    if (!payload.shift_name)
        errors.push("shift_name required");

    if (!payload.shift_start_time)
        errors.push("shift_start_time required");

    if (!payload.shift_end_time)
        errors.push("shift_end_time required");

    if (!payload.shift_duration)
        errors.push("shift_duration required");

    if (!payload.line_id)
        errors.push("line_id required");

    if (
        payload.shift_no &&
        (
            isNaN(payload.shift_no) ||
            Number(payload.shift_no) <= 0
        )
    ) {
        errors.push("Invalid shift_no");
    }

    if (
        payload.shift_duration &&
        (
            isNaN(payload.shift_duration) ||
            Number(payload.shift_duration) <= 0
        )
    ) {
        errors.push("Invalid shift_duration");
    }

    if (
        payload.shift_name &&
        payload.shift_name.trim().length < 3
    ) {
        errors.push(
            "shift_name minimum 3 characters"
        );
    }

    if (
        payload.shift_start_time &&
        payload.shift_end_time &&
        payload.shift_start_time ===
        payload.shift_end_time
    ) {
        errors.push(
            "Shift start and end time cannot be same"
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
        errors.push("Invalid status");
    }

    if (
        payload.is_night_shift !== undefined &&
        typeof payload.is_night_shift !== "boolean"
    ) {
        errors.push(
            "is_night_shift must be boolean"
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
        payload.shift_no !== undefined &&
        (
            isNaN(payload.shift_no) ||
            Number(payload.shift_no) <= 0
        )
    ) {
        errors.push("Invalid shift_no");
    }

    if (
        payload.shift_name !== undefined &&
        payload.shift_name.trim().length < 3
    ) {
        errors.push(
            "shift_name minimum 3 characters"
        );
    }

    if (
        payload.shift_duration !== undefined &&
        (
            isNaN(payload.shift_duration) ||
            Number(payload.shift_duration) <= 0
        )
    ) {
        errors.push(
            "Invalid shift_duration"
        );
    }

    if (
        payload.shift_start_time &&
        payload.shift_end_time &&
        payload.shift_start_time ===
        payload.shift_end_time
    ) {
        errors.push(
            "Shift start and end time cannot be same"
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
        errors.push("Invalid status");
    }

    if (
        payload.is_night_shift !== undefined &&
        typeof payload.is_night_shift !== "boolean"
    ) {
        errors.push(
            "is_night_shift must be boolean"
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

        "BREAK",

        "CALENDAR",

        "HOLIDAY"

    ];

    if (
        !types.includes(
            payload.config_type.toUpperCase()
        )
    ) {

        errors.push("Invalid config_type");

        return errors;

    }

    switch (
        payload.config_type.toUpperCase()
    ) {

        // ==========================================
        // BREAK CONFIG
        // ==========================================

        case "BREAK":

            if (!payload.shift_id)
                errors.push("shift_id required");

            if (!payload.break_name)
                errors.push("break_name required");

            if (!payload.break_start_time)
                errors.push("break_start_time required");

            if (!payload.break_end_time)
                errors.push("break_end_time required");

            if (
                payload.break_start_time &&
                payload.break_end_time &&
                payload.break_start_time ===
                payload.break_end_time
            ) {

                errors.push(
                    "Invalid break time"
                );

            }

            break;

        // ==========================================
        // CALENDAR
        // ==========================================

        case "CALENDAR":

            if (!payload.shift_id)
                errors.push("shift_id required");

            if (!payload.work_date)
                errors.push("work_date required");

            if (
                payload.shift_status &&
                ![
                    "WORKING",
                    "OFF",
                    "HOLIDAY",
                    "MAINTENANCE"
                ].includes(payload.shift_status)
            ) {

                errors.push(
                    "Invalid shift_status"
                );

            }

            break;

        // ==========================================
        // HOLIDAY
        // ==========================================

        case "HOLIDAY":

            if (!payload.plant_id)
                errors.push("plant_id required");

            if (!payload.holiday_date)
                errors.push("holiday_date required");

            if (!payload.reason)
                errors.push("reason required");

            break;

    }

    return errors;

}
// ==========================================================
// UPDATE CONFIG
// ==========================================================

function validateUpdateConfig(payload) {

    const errors = [];

    if (payload.config_type) {

        const types = [
            "BREAK",
            "CALENDAR",
            "HOLIDAY"
        ];

        if (
            !types.includes(
                payload.config_type.toUpperCase()
            )
        ) {
            errors.push("Invalid config_type");
        }

    }

    // BREAK

    if (
        payload.break_start_time &&
        payload.break_end_time &&
        payload.break_start_time ===
        payload.break_end_time
    ) {
        errors.push(
            "Invalid break time"
        );
    }

    // CALENDAR

    if (
        payload.shift_status &&
        ![
            "WORKING",
            "OFF",
            "HOLIDAY",
            "MAINTENANCE"
        ].includes(payload.shift_status)
    ) {
        errors.push(
            "Invalid shift_status"
        );
    }

    // HOLIDAY

    if (
        payload.reason !== undefined &&
        payload.reason.trim().length < 3
    ) {
        errors.push(
            "reason minimum 3 characters"
        );
    }

    return errors;

}

// ==========================================================
// EXECUTE
// ==========================================================

function validateExecute(payload) {

    const errors = [];

    if (!payload.shift_id)
        errors.push("shift_id required");

   

    if (!payload.runtime_status)
        errors.push("runtime_status required");

    const status = [

        "STARTED",

        "RUNNING",

        "BREAK",

        "COMPLETED",

        "STOPPED",

        "HOLIDAY"

    ];

    if (
        payload.runtime_status &&
        !status.includes(
            payload.runtime_status
        )
    ) {
        errors.push(
            "Invalid runtime_status"
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

