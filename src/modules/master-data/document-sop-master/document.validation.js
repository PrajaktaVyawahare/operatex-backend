// src/modules/document-sop-master/document.validation.js

// ==========================================================
// CREATE MASTER
// ==========================================================

function validateCreateMaster(payload) {

    const errors = [];

    if (!payload.document_no)
        errors.push("document_no required");

    if (!payload.document_name)
        errors.push("document_name required");

    if (!payload.document_type)
        errors.push("document_type required");

    if (
        payload.document_name &&
        payload.document_name.trim().length < 3
    ) {

        errors.push(
            "document_name minimum 3 characters"
        );

    }

    if (

        payload.status &&

        ![
            "ACTIVE",
            "INACTIVE",
            "OBSOLETE"
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

        payload.document_name &&

        payload.document_name.trim().length < 3

    ) {

        errors.push(
            "document_name minimum 3 characters"
        );

    }

    if (

        payload.status &&

        ![
            "ACTIVE",
            "INACTIVE",
            "OBSOLETE"
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

        "REVISION",

        "ACCESS"

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
        // REVISION
        // ==========================================

        case "REVISION":

            if (!payload.document_id)
                errors.push("document_id required");

            if (!payload.revision_no)
                errors.push("revision_no required");

            if (!payload.effective_from)
                errors.push("effective_from required");

            break;

        // ==========================================
        // ACCESS
        // ==========================================

        case "ACCESS":

            if (!payload.document_id)
                errors.push("document_id required");

            if (!payload.role_name)
                errors.push("role_name required");

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
            "REVISION",
            "ACCESS"
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

        payload.event_type.toUpperCase() !== "VIEW"

    ) {

        errors.push(
            "Invalid event_type"
        );

        return errors;

    }

    if (!payload.document_id)
        errors.push("document_id required");

    if (!payload.viewed_by)
        errors.push("viewed_by required");

    if (!payload.viewed_from)
        errors.push("viewed_from required");

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
            "OBSOLETE"
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