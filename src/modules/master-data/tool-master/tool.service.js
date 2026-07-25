// src/modules/tool-master/tool.service.js

const repo = require("./tool.repository");
const auditRepo = require("../../audit/audit.repository");
const configRepo = require("../../config/config.repository");

// ==========================================================
// CREATE MASTER
// ==========================================================

async function createMaster(payload, user) {

    // STEP 1 : Tenant Configuration

    await configRepo.getTenantConfig();

    // STEP 2 : Module License

    const license =
        await configRepo.getModuleLicense(
            "tool_master"
        );

    if (!license || Number(license.is_enabled) !== 1) {

        throw new Error(
            "Module disabled"
        );

    }

    // STEP 3 : Duplicate Tool Number

    const duplicateNo =
        await repo.checkDuplicateToolNo(
            payload.tool_no
        );

    if (duplicateNo) {

        throw new Error(
            "Tool number already exists"
        );

    }

    // STEP 4 : Duplicate Tool Name

    const duplicateName =
        await repo.checkDuplicateToolName(
            payload.tool_name
        );

    if (duplicateName) {

        throw new Error(
            "Tool name already exists"
        );

    }

    // STEP 5 : Machine Validation

    const machine =
        await repo.checkMachine(
            payload.machine_id
        );

    if (!machine) {

        throw new Error(
            "Invalid Machine"
        );

    }

    // STEP 6 : Business Rule

    if (
        Number(payload.life_limit) <= 0
    ) {

        throw new Error(
            "Life limit must be greater than zero"
        );

    }

    // STEP 7 : Create Tool

    const tool =
        await repo.createMaster(
            payload
        );

    // STEP 8 : Audit

    await auditRepo.create({

        action: "CREATE",

        module: "tool_master",

        user_id: user.user_id,

        entity_id: tool.tool_id,

        payload

    });

    return tool;

}

// ==========================================================
// GET MASTER
// ==========================================================

async function getMaster() {

    return await repo.getMaster();

}

// ==========================================================
// GET MASTER BY ID
// ==========================================================

async function getMasterById(id) {

    const tool =
        await repo.getMasterById(id);

    if (!tool) {

        throw new Error(
            "Tool not found"
        );

    }

    return tool;

}

// ==========================================================
// UPDATE MASTER
// ==========================================================

async function updateMaster(id, payload, user) {

    // STEP 1 : Existing Tool

    const existing =
        await repo.getMasterById(id);

    if (!existing) {

        throw new Error(
            "Tool not found"
        );

    }

    // STEP 2 : Duplicate Tool Number

    if (payload.tool_no !== undefined) {

        const duplicate =
            await repo.checkDuplicateToolNoForUpdate(

                payload.tool_no,

                id

            );

        if (duplicate) {

            throw new Error(
                "Tool number already exists"
            );

        }

    }

    // STEP 3 : Duplicate Tool Name

    if (payload.tool_name !== undefined) {

        const duplicate =
            await repo.checkDuplicateToolNameForUpdate(

                payload.tool_name,

                id

            );

        if (duplicate) {

            throw new Error(
                "Tool name already exists"
            );

        }

    }

    // STEP 4 : Machine Validation

    if (payload.machine_id !== undefined) {

        const machine =
            await repo.checkMachine(
                payload.machine_id
            );

        if (!machine) {

            throw new Error(
                "Invalid Machine"
            );

        }

    }

    // STEP 5 : Life Limit Validation

    if (
        payload.life_limit !== undefined &&
        Number(payload.life_limit) <= 0
    ) {

        throw new Error(
            "Life limit must be greater than zero"
        );

    }

    // STEP 6 : Update Tool

    const updated =
        await repo.updateMaster(

            id,

            payload

        );

    // STEP 7 : Audit

    await auditRepo.create({

        action: "UPDATE",

        module: "tool_master",

        user_id: user.user_id,

        entity_id: id,

        payload

    });

    return updated;

}

// ==========================================================
// DELETE MASTER
// ==========================================================

async function deleteMaster(id, user) {

    // STEP 1 : Existing Tool

    const existing =
        await repo.getMasterById(id);

    if (!existing) {

        throw new Error(
            "Tool not found"
        );

    }

    // STEP 2 : Business Rule

    if (existing.status === "INACTIVE") {

        throw new Error(
            "Tool already inactive"
        );

    }

    // STEP 3 : Soft Delete

    const deleted =
        await repo.deleteMaster(id);

    // STEP 4 : Audit

    await auditRepo.create({

        action: "DELETE",

        module: "tool_master",

        user_id: user.user_id,

        entity_id: id,

        payload: existing

    });

    return deleted;

}
// ==========================================================
// GET CONFIG
// ==========================================================

async function getConfig() {

    return await repo.getConfig();

}

// ==========================================================
// GET CONFIG BY ID
// ==========================================================

async function getConfigById(id) {

    const config =
        await repo.getConfigById(id);

    if (!config) {

        throw new Error(
            "Configuration not found"
        );

    }

    return config;

}

// ==========================================================
// CREATE CONFIG
// ==========================================================

async function createConfig(payload, user) {

    // STEP 1 : Tenant Configuration

    await configRepo.getTenantConfig();

    // STEP 2 : Module License

    const license =
        await configRepo.getModuleLicense(
            "tool_master"
        );

    if (!license || Number(license.is_enabled) !== 1) {

        throw new Error(
            "Module disabled"
        );

    }

    // STEP 3 : Tool Validation

    const tool =
        await repo.checkTool(
            payload.tool_id
        );

    if (!tool) {

        throw new Error(
            "Invalid Tool"
        );

    }

    // STEP 4 : Config Validation

    switch (
        payload.config_type.toUpperCase()
    ) {

        case "LIFE":

            if (
                Number(payload.warning_percent) >=
                Number(payload.critical_percent)
            ) {

                throw new Error(
                    "Warning percent must be less than critical percent"
                );

            }

            break;

        case "CALIBRATION":

            if (
                Number(payload.calibration_interval) <= 0
            ) {

                throw new Error(
                    "Invalid calibration interval"
                );

            }

            break;

        default:

            throw new Error(
                "Invalid config type"
            );

    }

    // STEP 5 : Save Configuration

    const config =
        await repo.createConfig(
            payload
        );

    // STEP 6 : Audit

    await auditRepo.create({

        action: "CONFIG_CREATE",

        module: "tool_master",

        user_id: user.user_id,

        entity_id: tool.tool_id,

        payload

    });

    return config;

}

// ==========================================================
// UPDATE CONFIG
// ==========================================================

async function updateConfig(
    table,
    id,
    payload,
    user
) {

    const updated =
        await repo.updateConfig(

            table,

            id,

            payload

        );

    if (!updated) {

        throw new Error(
            "Configuration not found"
        );

    }

    await auditRepo.create({

        action: "CONFIG_UPDATE",

        module: "tool_master",

        user_id: user.user_id,

        entity_id: id,

        payload

    });

    return updated;

}

// ==========================================================
// DELETE CONFIG
// ==========================================================

async function deleteConfig(
    table,
    id,
    user
) {

    const deleted =
        await repo.deleteConfig(

            table,

            id

        );

    if (!deleted) {

        throw new Error(
            "Configuration not found"
        );

    }

    await auditRepo.create({

        action: "CONFIG_DELETE",

        module: "tool_master",

        user_id: user.user_id,

        entity_id: id,

        payload: deleted

    });

    return deleted;

}
// ==========================================================
// GET RUNTIME
// ==========================================================

async function getRuntime(filters) {

    return await repo.getRuntime(
        filters
    );

}

// ==========================================================
// EXECUTE
// ==========================================================

async function execute(payload, user) {

    // STEP 1 : Module License

    const license =
        await configRepo.getModuleLicense(
            "tool_master"
        );

    if (!license || Number(license.is_enabled) !== 1) {

        throw new Error(
            "Module disabled"
        );

    }

    // STEP 2 : Tool Validation

    const tool =
        await repo.checkTool(
            payload.tool_id
        );

    if (!tool) {

        throw new Error(
            "Tool not found"
        );

    }

    // STEP 3 : Event Validation

    switch (
        payload.event_type.toUpperCase()
    ) {

        // ==========================================
        // TOOL USAGE
        // ==========================================

        case "USAGE":

            if (
                payload.cycle_count === undefined ||
                Number(payload.cycle_count) < 0
            ) {

                throw new Error(
                    "Invalid cycle count"
                );

            }

            if (
                payload.usage_count === undefined ||
                Number(payload.usage_count) < 0
            ) {

                throw new Error(
                    "Invalid usage count"
                );

            }

            break;

        // ==========================================
        // TOOL REPLACEMENT
        // ==========================================

        case "REPLACEMENT":

            if (!payload.reason) {

                throw new Error(
                    "Replacement reason required"
                );

            }

            if (!payload.replaced_by) {

                throw new Error(
                    "Replaced by required"
                );

            }

            break;

        // ==========================================
        // TOOL OFFSET
        // ==========================================

        case "OFFSET":

            if (!payload.offset_no) {

                throw new Error(
                    "Offset number required"
                );

            }

            if (payload.value === undefined) {

                throw new Error(
                    "Offset value required"
                );

            }

            break;

        default:

            throw new Error(
                "Invalid event type"
            );

    }

    // STEP 4 : Execute Runtime

    const runtime =
        await repo.execute(
            payload
        );

    // STEP 5 : Audit

    await auditRepo.create({

        action: "EXECUTE",

        module: "tool_runtime",

        user_id: user.user_id,

        entity_id:
            payload.tool_id,

        payload

    });

    return runtime;

}
// ==========================================================
// REPORT
// ==========================================================

async function getReport(filters) {

    return await repo.getReport(
        filters
    );

}

// ==========================================================
// EXPORT
// ==========================================================

async function exportData(filters) {

    return await repo.exportData(
        filters
    );

}

// ==========================================================
// EXPORTS
// ==========================================================

module.exports = {

    // Master

    createMaster,

    getMaster,

    getMasterById,

    updateMaster,

    deleteMaster,

    // Config

    getConfig,

    getConfigById,

    createConfig,

    updateConfig,

    deleteConfig,

    // Runtime

    getRuntime,

    execute,

    // Report

    getReport,

    exportData

};