// src/modules/route-station-master/station.validation.js

// ==========================================================
// CREATE MASTER
// ==========================================================

function validateCreateMaster(payload) {

    const errors = [];

    if (!payload.line_id)
        errors.push("line_id required");

    if (!payload.station_no)
        errors.push("station_no required");

    if (!payload.station_name)
        errors.push("station_name required");

    if (!payload.station_type)
        errors.push("station_type required");

    if (
        payload.station_no &&
        (
            isNaN(payload.station_no) ||
            Number(payload.station_no) <= 0
        )
    ) {
        errors.push("Invalid station_no");
    }

    if (
        payload.station_name &&
        payload.station_name.trim().length < 3
    ) {
        errors.push(
            "station_name minimum 3 characters"
        );
    }

    if (
        payload.station_type &&
        payload.station_type.trim().length < 3
    ) {
        errors.push(
            "station_type minimum 3 characters"
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

    return errors;

}

// ==========================================================
// UPDATE MASTER
// ==========================================================

function validateUpdateMaster(payload) {

    const errors = [];

    if (
        payload.station_no !== undefined &&
        (
            isNaN(payload.station_no) ||
            Number(payload.station_no) <= 0
        )
    ) {
        errors.push("Invalid station_no");
    }

    if (
        payload.station_name !== undefined &&
        payload.station_name.trim().length < 3
    ) {
        errors.push(
            "station_name minimum 3 characters"
        );
    }

    if (
        payload.station_type !== undefined &&
        payload.station_type.trim().length < 3
    ) {
        errors.push(
            "station_type minimum 3 characters"
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

    return errors;

}

// ==========================================================
// EXPORTS
// ==========================================================

module.exports = {

    validateCreateMaster,

    validateUpdateMaster

};