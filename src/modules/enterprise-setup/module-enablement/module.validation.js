// src/modules/enterprise-setup/module-enablement/module.validation.js

// ==========================================================
// MASTER VALIDATION
// ==========================================================

function validateCreateMaster(payload) {

    if (!payload.module_name) {
        throw new Error("Module name is required");
    }

    if (!payload.display_name) {
        throw new Error("Display name is required");
    }

    if (!payload.module_group) {
        throw new Error("Module group is required");
    }

}

function validateUpdateMaster(payload) {

    if (Object.keys(payload).length === 0) {
        throw new Error("No data provided for update");
    }

}

// ==========================================================
// CONFIG VALIDATION
// ==========================================================

function validateModuleToggle(payload) {

    if (!payload.module_name) {
        throw new Error("Module name is required");
    }

    if (
        payload.is_enabled === undefined ||
        payload.is_enabled === null
    ) {
        throw new Error("is_enabled is required");
    }

    if (
        Number(payload.is_enabled) !== 0 &&
        Number(payload.is_enabled) !== 1
    ) {
        throw new Error("is_enabled must be 0 or 1");
    }

}

function validateFeatureToggle(payload) {

    if (!payload.feature_id) {
        throw new Error("Feature ID is required");
    }

    if (
        payload.is_enabled === undefined ||
        payload.is_enabled === null
    ) {
        throw new Error("is_enabled is required");
    }

    if (
        Number(payload.is_enabled) !== 0 &&
        Number(payload.is_enabled) !== 1
    ) {
        throw new Error("is_enabled must be 0 or 1");
    }

}

// ==========================================================
// EXECUTE VALIDATION
// ==========================================================

function validateExecute(payload) {

    if (!payload.action) {
        throw new Error("Action is required");
    }

    const actions = [

        "ENABLE_MODULE",

        "DISABLE_MODULE",

        "ENABLE_FEATURE",

        "DISABLE_FEATURE",

        "REFRESH_LICENSE"

    ];

    if (!actions.includes(payload.action)) {
        throw new Error("Invalid action");
    }

}

// ==========================================================
// EXPORTS
// ==========================================================

module.exports = {

    validateCreateMaster,

    validateUpdateMaster,

    validateModuleToggle,

    validateFeatureToggle,

    validateExecute

};