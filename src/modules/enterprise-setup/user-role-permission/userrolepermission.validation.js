// src/modules/user-role-permission/userRolePermission.validation.js

function validateMaster(payload) {

    const errors = [];

    if (!payload.type) {
        errors.push("type required");
        return errors;
    }

    switch (payload.type) {

        case "USER":

            if (!payload.employee_code)
                errors.push("employee_code required");

            if (!payload.username)
                errors.push("username required");

            if (!payload.role_id)
                errors.push("role_id required");

            if (!payload.mobile_number)
                errors.push("mobile_number required");

            if (!payload.status)
                errors.push("status required");

            if (
                payload.email_id &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email_id)
            ) {
                errors.push("Invalid email");
            }

            break;

        case "ROLE":

            if (!payload.role_code)
                errors.push("role_code required");

            if (!payload.role_name)
                errors.push("role_name required");

            break;

        case "PERMISSION":

            if (!payload.permission_code)
                errors.push("permission_code required");

            if (!payload.module_name)
                errors.push("module_name required");

            if (!payload.action)
                errors.push("action required");

            break;

        case "ROLE_PERMISSION":

            if (!payload.role_id)
                errors.push("role_id required");

            if (!payload.permission_id)
                errors.push("permission_id required");

            break;

        case "USER_MACHINE":

            if (!payload.user_id)
                errors.push("user_id required");

            if (!payload.machine_id)
                errors.push("machine_id required");

            if (!payload.access_type)
                errors.push("access_type required");

            break;

        default:

            errors.push("Invalid type");

    }

    return errors;
}

function validateExecute(payload) {

    const errors = [];

    if (!payload.action) {
        errors.push("action required");
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
            "LOCKED"
        ].includes(query.status)
    ) {
        errors.push("Invalid status");
    }

    return errors;
}

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
        !formats.includes(payload.format.toUpperCase())
    ) {
        errors.push("Invalid export format");
    }

    return errors;
}

module.exports = {

    validateMaster,

    validateExecute,

    validateReport,

    validateExport

};