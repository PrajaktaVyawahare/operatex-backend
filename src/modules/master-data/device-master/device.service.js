const repo = require("./device.repository");
const auditRepo = require("../../audit/audit.repository");
const configRepo = require("../../config/config.repository");

// ======================================================
// GET CONFIG
// ======================================================

async function getConfig() {

    return repo.getConfig();

}

// ======================================================
// UPDATE CONFIG
// ======================================================

async function updateConfig(payload, user) {

    const result =
        await repo.updateConfig(payload);

    await auditRepo.create({
        action: "CONFIG_UPDATE",
        module: "device_master",
        user_id: user.user_id,
        entity_id: payload.device_id,
        payload
    });

    return result;

}

// ======================================================
// GET MASTER
// ======================================================

async function getMaster() {

    return repo.getMaster();

}

// ======================================================
// CREATE MASTER
// ======================================================

async function createMaster(payload, user) {

    const tenantConfig =
        await configRepo.getTenantConfig();

    const license =
        await configRepo.getModuleLicense(
            "device_master"
        );

    if (
        !license ||
        Number(license.is_enabled) !== 1
    ) {
        throw new Error(
            "Module disabled"
        );
    }

    const result =
        await repo.createMaster(
            payload
        );

    await auditRepo.create({

        action: "CREATE",

        module: "device_master",

        user_id: user.user_id,

        entity_id: result.device_id,

        payload

    });

    return result;

}

// ======================================================
// UPDATE MASTER
// ======================================================

async function updateMaster(
    id,
    payload,
    user
) {

    const license =
        await configRepo.getModuleLicense(
            "device_master"
        );

    if (
        !license ||
        Number(license.is_enabled) !== 1
    ) {
        throw new Error(
            "Module disabled"
        );
    }

    const result =
        await repo.updateMaster(
            id,
            payload
        );

    await auditRepo.create({

        action: "UPDATE",

        module: "device_master",

        user_id: user.user_id,

        entity_id: id,

        payload

    });

    return result;

}

// ======================================================
// GET RUNTIME
// ======================================================

async function getRuntime(user) {

    const license =
        await configRepo.getModuleLicense(
            "device_master"
        );

    if (
        !license ||
        Number(license.is_enabled) !== 1
    ) {
        throw new Error("Module disabled");
    }

    const result =
        await repo.getRuntime();

    await auditRepo.create({

        action: "RUNTIME",

        module: "device_master",

        user_id: user.user_id,

        entity_id: null,

        payload: {}

    });

    return result;

}

// ======================================================
// EXECUTE ACTION
// ======================================================

async function executeAction(
    payload,
    user
) {

    const license =
        await configRepo.getModuleLicense(
            "device_master"
        );

    if (
        !license ||
        Number(license.is_enabled) !== 1
    ) {
        throw new Error("Module disabled");
    }

    const result =
        await repo.executeAction(
            payload.device_id
        );

    await auditRepo.create({

        action: "EXECUTE",

        module: "device_master",

        user_id: user.user_id,

        entity_id: payload.device_id,

        payload

    });

    return result;

}

// ======================================================
// GET REPORT
// ======================================================

async function getReport(user) {

    const license =
        await configRepo.getModuleLicense(
            "device_master"
        );

    if (
        !license ||
        Number(license.is_enabled) !== 1
    ) {
        throw new Error("Module disabled");
    }

    const result =
        await repo.getReport();

    await auditRepo.create({

        action: "REPORT",

        module: "device_master",

        user_id: user.user_id,

        entity_id: null,

        payload: {}

    });

    return result;

}

// ======================================================
// EXPORT
// ======================================================

async function exportData(user) {

    const license =
        await configRepo.getModuleLicense(
            "device_master"
        );

    if (
        !license ||
        Number(license.is_enabled) !== 1
    ) {
        throw new Error("Module disabled");
    }

    const result =
        await repo.exportData();

    await auditRepo.create({

        action: "EXPORT",

        module: "device_master",

        user_id: user.user_id,

        entity_id: null,

        payload: {}

    });

    return result;

}

// ======================================================
// GET MASTER BY ID
// ======================================================

const getMasterById = async (id) => {

    const license =
        await configRepo.getModuleLicense("device_master");

    if (!license || Number(license.is_enabled) !== 1) {
        throw new Error("Module disabled");
    }

    const device =
        await repo.getMasterById(id);

    if (!device) {
        throw new Error("Device not found");
    }

    return {
        success: true,
        message: "Device fetched successfully",
        data: device,
        errors: [],
        meta: {}
    };

};

// ======================================================
// PATCH MASTER
// ======================================================

const patchMaster = async (id, payload, user) => {

    const license =
        await configRepo.getModuleLicense("device_master");

    if (!license || Number(license.is_enabled) !== 1) {
        throw new Error("Module disabled");
    }

    const device =
        await repo.patchMaster(id, payload);

    if (!device) {
        throw new Error("Device not found");
    }

    await auditRepo.create({
        action: "PATCH",
        module: "DEVICE_MASTER",
        user_id: user.user_id,
        entity_id: id,
        payload
    });

    return {
        success: true,
        message: "Device updated successfully",
        data: device,
        errors: [],
        meta: {}
    };

};

// ======================================================
// DELETE MASTER
// ======================================================

const deleteMaster = async (id, user) => {

    const license =
        await configRepo.getModuleLicense("device_master");

    if (!license || Number(license.is_enabled) !== 1) {
        throw new Error("Module disabled");
    }

    const device =
        await repo.deleteMaster(id);

    if (!device) {
        throw new Error("Device not found");
    }

    await auditRepo.create({
        action: "DELETE",
        module: "DEVICE_MASTER",
        user_id: user.user_id,
        entity_id: id,
        payload: device
    });

    return {
        success: true,
        message: "Device deleted successfully",
        data: device,
        errors: [],
        meta: {}
    };

};

// ======================================================
// DELETE MULTIPLE MASTER
// ======================================================

const deleteMultipleMaster = async (ids, user) => {

    const license =
        await configRepo.getModuleLicense("device_master");

    if (!license || Number(license.is_enabled) !== 1) {
        throw new Error("Module disabled");
    }

    const devices =
        await repo.deleteMultipleMaster(ids);

    if (!devices.length) {
        throw new Error("No devices found");
    }

    await auditRepo.create({
        action: "DELETE_MULTIPLE",
        module: "DEVICE_MASTER",
        user_id: user.user_id,
        entity_id: null,
        payload: { ids }
    });

    return {
        success: true,
        message: "Devices deleted successfully",
        data: devices,
        errors: [],
        meta: {}
    };

};

module.exports = {

    getConfig,

    updateConfig,

    getMaster,

    createMaster,

    updateMaster,

    getRuntime,

    executeAction,

    getReport,

    getMasterById,

    patchMaster,

    deleteMaster,

    deleteMultipleMaster,

    exportData

};