const repo = require("./line.repository");
const auditRepo = require("../../audit/audit.repository");
const configRepo = require("../../config/config.repository");

async function getConfig(user) {

    const tenantConfig =
        await configRepo.getTenantConfig();

    const license =
        await configRepo.getModuleLicense("line_master");

    if (!license || Number(license.is_enabled) !== 1) {
        throw new Error("Module disabled");
    }

    const result = await repo.getConfig();

    await auditRepo.create({
        action: "VIEW_CONFIG",
        module: "line_master",
        user_id: user.user_id,
        entity_id: null,
        payload: {}
    });

    return {
        tenantConfig,
        lineConfig: result
    };
}

async function updateConfig(payload, user) {

    const license =
        await configRepo.getModuleLicense("line_master");

    if (!license || Number(license.is_enabled) !== 1) {
        throw new Error("Module disabled");
    }

    await auditRepo.create({
        action: "UPDATE_CONFIG",
        module: "line_master",
        user_id: user.user_id,
        entity_id: null,
        payload
    });

    return {
        success: true,
        message: "Configuration updated"
    };
}

async function getMaster(user) {

    const license =
        await configRepo.getModuleLicense("line_master");

    if (!license || Number(license.is_enabled) !== 1) {
        throw new Error("Module disabled");
    }

    const result =
        await repo.getMaster();

    await auditRepo.create({
        action: "VIEW_MASTER",
        module: "line_master",
        user_id: user.user_id,
        entity_id: null,
        payload: {}
    });

    return result;
}

async function createMaster(payload, user) {

    const tenantConfig =
        await configRepo.getTenantConfig();

    const license =
        await configRepo.getModuleLicense("line_master");

    if (!license || Number(license.is_enabled) !== 1) {
        throw new Error("Module disabled");
    }

    const duplicate =
        await repo.checkDuplicateLineCode(
            payload.shop_id,
            payload.line_code
        );

    if (duplicate) {
        throw new Error("Line code already exists");
    }

    const result =
        await repo.createMaster(payload);

    await auditRepo.create({
        action: "CREATE",
        module: "line_master",
        user_id: user.user_id,
        entity_id: result.line_id,
        payload
    });

    return result;
}

async function updateMaster(id, payload, user) {

    const license =
        await configRepo.getModuleLicense("line_master");

    if (!license || Number(license.is_enabled) !== 1) {
        throw new Error("Module disabled");
    }

    const existing =
        await repo.getById(id);

    if (!existing) {
        throw new Error("Line not found");
    }

    const result =
        await repo.updateMaster(id, payload);

    await auditRepo.create({
        action: "UPDATE",
        module: "line_master",
        user_id: user.user_id,
        entity_id: id,
        payload
    });

    return result;
}

async function getRuntime(user) {

    const license =
        await configRepo.getModuleLicense("line_master");

    if (!license || Number(license.is_enabled) !== 1) {
        throw new Error("Module disabled");
    }

    const result =
        await repo.getRuntime();

    await auditRepo.create({
        action: "VIEW_RUNTIME",
        module: "line_master",
        user_id: user.user_id,
        entity_id: null,
        payload: {}
    });

    return result;
}

async function executeAction(payload, user) {

    const license =
        await configRepo.getModuleLicense("line_master");

    if (!license || Number(license.is_enabled) !== 1) {
        throw new Error("Module disabled");
    }

    const actions = [
        "START",
        "STOP",
        "RESET",
        "SYNC",
        "ENABLE",
        "DISABLE"
    ];

    if (!actions.includes(payload.action)) {
        throw new Error("Invalid action");
    }

    const line =
        await repo.getById(payload.line_id);

    if (!line) {
        throw new Error("Line not found");
    }

    await auditRepo.create({
        action: payload.action,
        module: "line_master",
        user_id: user.user_id,
        entity_id: payload.line_id,
        payload
    });

    return {
        success: true,
        action: payload.action,
        line_id: payload.line_id
    };
}

async function getReport(user) {

    const license =
        await configRepo.getModuleLicense("line_master");

    if (!license || Number(license.is_enabled) !== 1) {
        throw new Error("Module disabled");
    }

    const result =
        await repo.getReport();

    await auditRepo.create({
        action: "VIEW_REPORT",
        module: "line_master",
        user_id: user.user_id,
        entity_id: null,
        payload: {}
    });

    return result;
}

async function exportData(payload, user) {

    const license =
        await configRepo.getModuleLicense("line_master");

    if (!license || Number(license.is_enabled) !== 1) {
        throw new Error("Module disabled");
    }

    const result =
        await repo.getReport();

    await auditRepo.create({
        action: "EXPORT",
        module: "line_master",
        user_id: user.user_id,
        entity_id: null,
        payload
    });

    return result;
}

module.exports = {
    getConfig,
    updateConfig,
    getMaster,
    createMaster,
    updateMaster,
    getRuntime,
    executeAction,
    getReport,
    exportData
};