const repo = require("./module.repository");
const auditRepo = require("../../audit/audit.repository");
const configRepo = require("../../config/config.repository");
const validation = require("./module.validation");

// ==========================================================
// MODULE LICENSE CHECK
// ==========================================================

async function checkModule() {

    await configRepo.getTenantConfig();

    const license =
        await configRepo.getModuleLicense(
            "module_enablement"
        );

    if (!license || Number(license.is_enabled) !== 1) {

        throw new Error("Module disabled");

    }

}

// ==========================================================
// MASTER
// ==========================================================

async function createMaster(payload, user) {

   

    validation.validateCreateMaster(payload);

    const result =
        await repo.createMaster(payload);

    await auditRepo.create({

        action: "CREATE",

        module: "module_enablement",

        user_id: user.user_id,

        entity_id: result.module_config_id,

        payload

    });

    return result;

}

async function getMaster() {

   

    return await repo.getMaster();

}

async function updateMaster(id, payload, user) {

   

    validation.validateUpdateMaster(payload);

    const result =
        await repo.updateMaster(id, payload);

    if (!result) {

        throw new Error(
            "Module not found"
        );

    }

    await auditRepo.create({

        action: "UPDATE",

        module: "module_enablement",

        user_id: user.user_id,

        entity_id: id,

        payload

    });

    return result;

}

// ==========================================================
// CONFIG
// ==========================================================

async function getConfig(user) {


    return await repo.getConfig(
        
    );

}

async function updateModuleConfig(payload, user) {

    

    validation.validateModuleToggle(
        payload
    );
  

    const result =
        await repo.updateModuleLicense(

          

            payload

        );

    if (!result) {

        throw new Error(
            "Module not found"
        );

    }

    await auditRepo.create({

        action: "MODULE_TOGGLE",

        module: "module_enablement",

        user_id: user.user_id,

        entity_id: result.license_id,

        payload

    });

    return result;

}

// ==========================================================
// FEATURE FLAG
// ==========================================================

async function updateFeatureFlag(payload, user) {

    

    validation.validateFeatureToggle(
        payload
    );

    const result =
        await repo.updateFeatureFlag(

            payload.feature_id,

            payload.is_enabled

        );

    if (!result) {

        throw new Error(
            "Feature not found"
        );

    }

    await auditRepo.create({

        action: "FEATURE_TOGGLE",

        module: "module_enablement",

        user_id: user.user_id,

        entity_id: payload.feature_id,

        payload

    });

    return result;

}

// ==========================================================
// RUNTIME
// ==========================================================

async function getRuntime(user) {

    

    return await repo.getRuntime(
        
    );

}

// ==========================================================
// EXECUTE
// ==========================================================

async function executeAction(payload, user) {

    

    validation.validateExecute(
        payload
    );

    switch (payload.action) {

        case "ENABLE_MODULE":

        case "DISABLE_MODULE":

            return await updateModuleConfig(
                {

                    module_name:
                        payload.module_name,

                    is_enabled:
                        payload.action ===
                        "ENABLE_MODULE"
                            ? 1
                            : 0

                },

                user

            );

        case "ENABLE_FEATURE":

        case "DISABLE_FEATURE":

            return await updateFeatureFlag(

                {

                    feature_id:
                        payload.feature_id,

                    is_enabled:
                        payload.action ===
                        "ENABLE_FEATURE"
                            ? 1
                            : 0

                },

                user

            );

        case "REFRESH_LICENSE":

            await auditRepo.create({

                action: "REFRESH_LICENSE",

                module: "module_enablement",

                user_id: user.user_id,

                entity_id: null,

                payload

            });

            return {

                success: true,

                message:
                    "License refreshed successfully"

            };

        default:

            throw new Error(
                "Invalid action"
            );

    }

}

// ==========================================================
// REPORT
// ==========================================================

async function getReport(user) {

    

    return await repo.getReport(
        
    );

}

// ==========================================================
// EXPORT
// ==========================================================

async function exportData(user) {

    

    return await repo.exportData(
       
    );

}

// ==========================================================
// EXPORTS
// ==========================================================

module.exports = {

    createMaster,

    getMaster,

    updateMaster,

    getConfig,

    updateModuleConfig,

    updateFeatureFlag,

    getRuntime,

    executeAction,

    getReport,

    exportData

};