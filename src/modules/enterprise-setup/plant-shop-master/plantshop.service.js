const repo = require("./plantshop.repository");
const auditRepo = require("../../audit/audit.repository");
const configRepo = require("../../config/config.repository");

// ==========================================================
// MODULE LICENSE CHECK
// ==========================================================

async function checkModule() {

    const license = await configRepo.getModuleLicense(
        "plant_shop_master"
    );

    if (!license || Number(license.is_enabled) !== 1) {
        throw new Error("Module disabled");
    }

}

// ==========================================================
// CONFIG
// ==========================================================

async function getConfig() {

    await checkModule();

    return repo.getConfig();

}

// ==========================================================
// MASTER
// ==========================================================

async function getMaster() {

    await checkModule();

    return repo.getMaster();

}

async function createMaster(payload, user) {

    await checkModule();

    await configRepo.getTenantConfig();

    if (payload.type === "SHOP") {

        const plant =
            await repo.getPlantById(
                payload.plant_id
            );

        if (!plant) {
            throw new Error(
                "Parent plant not found"
            );
        }

        if (plant.status !== "ACTIVE") {
            throw new Error(
                "Parent plant inactive"
            );
        }

    }

    const result =
        await repo.createMaster(
            payload,
            user
        );

    await auditRepo.create({

        action: "CREATE",

        module: "plant_shop_master",

        user_id: user.user_id,

        entity_id:
            result.plant_id ||
            result.shop_id,

        payload

    });

    return result;

}

async function updateMaster(
    id,
    payload,
    user
) {

    await checkModule();

    let existing;

    if (payload.type === "PLANT") {

        existing =
            await repo.getPlantById(id);

    }

    if (payload.type === "SHOP") {

        existing =
            await repo.getShopById(id);

    }

    if (!existing) {
        throw new Error("Record not found");
    }

    const result =
        await repo.updateMaster(
            id,
            payload,
            user
        );

    await auditRepo.create({

        action: "UPDATE",

        module: "plant_shop_master",

        user_id: user.user_id,

        entity_id: id,

        payload

    });

    return result;

}

// ==========================================================
// RUNTIME
// ==========================================================

async function getRuntime() {

    await checkModule();

    return repo.getRuntime();

}

async function executeAction(
    payload,
    user
) {

    await checkModule();

    const allowedActions = [
        "SYNC",
        "REBUILD_HIERARCHY",
        "VALIDATE_RELATION"
    ];

    if (
        !payload.action ||
        !allowedActions.includes(
            payload.action
        )
    ) {
        throw new Error(
            "Invalid action"
        );
    }

    await auditRepo.create({

        action: payload.action,

        module: "plant_shop_master",

        user_id: user.user_id,

        entity_id: null,

        payload

    });

    return {

        executed: true,

        action: payload.action

    };

}

// ==========================================================
// REPORT
// ==========================================================

async function getReport() {

    await checkModule();

    return repo.getReport();

}

// ==========================================================
// EXPORT
// ==========================================================

async function exportData() {

    await checkModule();

    return repo.getReport();

}

// ==========================================================
// EXPORTS
// ==========================================================

module.exports = {

    getConfig,

    getMaster,

    createMaster,

    updateMaster,

    getRuntime,

    executeAction,

    getReport,

    exportData

};