const repo = require("./signal.repository");
const auditRepo = require("../../audit/audit.repository");
const configRepo = require("../../config/config.repository");

// ==========================================================
// PROTOCOL CONFIG
// ==========================================================

async function getProtocolConfig() {

    return repo.getProtocolConfig();

}

async function updateProtocolConfig(payload, user) {

    const updated =
        await repo.updateProtocolConfig(payload);

    await auditRepo.create({

        action: "UPDATE",

        module: "signal_mapping_protocol_config",

        user_id: user.user_id,

        entity_id: updated.protocol_id,

        payload

    });

    return updated;

}

// ==========================================================
// GATEWAY CONFIG
// ==========================================================

async function getGatewayConfig() {

    return repo.getGatewayConfig();

}

async function updateGatewayConfig(payload, user) {

    const updated =
        await repo.updateGatewayConfig(payload);

    await auditRepo.create({

        action: "UPDATE",

        module: "signal_mapping_gateway_config",

        user_id: user.user_id,

        entity_id: updated.gateway_id,

        payload

    });

    return updated;

}

// ==========================================================
// CONFIG (OLD)
// ==========================================================

async function getConfig() {

    return repo.getConfig();

}

// ==========================================================
// MASTER
// ==========================================================

async function getMaster() {

    return repo.getMaster();

}

async function getMasterById(id) {

    return repo.getMasterById(id);

}

async function createMaster(payload, user) {

    await configRepo.getTenantConfig();

    const license =
        await configRepo.getModuleLicense(
            "signal_mapping"
        );

    if (!license || Number(license.is_enabled) !== 1) {
        throw new Error("Module disabled");
    }

    const mapping =
        await repo.createMaster(payload);

    await auditRepo.create({

        action: "CREATE",

        module: "signal_mapping",

        user_id: user.user_id,

        entity_id: mapping.mapping_id,

        payload

    });

    return mapping;

}

async function updateMaster(id, payload, user) {

    const mapping =
        await repo.getMasterById(id);

    if (!mapping) {
        throw new Error("Signal Mapping not found");
    }

    const updated =
        await repo.updateMaster(id, payload);

    await auditRepo.create({

        action: "UPDATE",

        module: "signal_mapping",

        user_id: user.user_id,

        entity_id: id,

        payload

    });

    return updated;

}

async function deleteMaster(id, user) {

    const deleted =
        await repo.deleteMaster(id);

    await auditRepo.create({

        action: "DELETE",

        module: "signal_mapping",

        user_id: user.user_id,

        entity_id: id,

        payload: {}

    });

    return deleted;

}

async function deleteMultipleMaster(ids, user) {

    const deleted =
        await repo.deleteMultipleMaster(ids);

    await auditRepo.create({

        action: "DELETE_MULTIPLE",

        module: "signal_mapping",

        user_id: user.user_id,

        entity_id: null,

        payload: ids

    });

    return deleted;

}

// ==========================================================
// RUNTIME
// ==========================================================

async function getRuntime() {

    return repo.getRuntime();

}

// ==========================================================
// EXECUTE
// ==========================================================

async function executeAction(payload, user) {

    const event =
        await repo.executeAction(payload);

    await auditRepo.create({

        action: "EXECUTE",

        module: "signal_mapping",

        user_id: user.user_id,

        entity_id: event.raw_event_id || event.mapping_id,

        payload

    });

    return event;

}

// ==========================================================
// REPORT
// ==========================================================

async function getReport(filters) {

    return repo.getReport(filters);

}

// ==========================================================
// EXPORT
// ==========================================================

async function exportData(filters) {

    return repo.exportData(filters);

}

module.exports = {
    getProtocolConfig,
    updateProtocolConfig,

    getGatewayConfig,
    updateGatewayConfig,

    getMaster,
    getMasterById,
    createMaster,
    updateMaster,
    deleteMaster,
    deleteMultipleMaster,

    getRuntime,
    executeAction,

    getReport,
    exportData
};