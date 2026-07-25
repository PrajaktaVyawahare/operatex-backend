const repo = require("./userRolePermission.repository");
const auditRepo = require("../../audit/audit.repository");
const configRepo = require("../../config/config.repository");

// ==========================================================
// CREATE USER / ROLE / PERMISSION
// ==========================================================

async function createMaster(payload, user) {

    // STEP 1 : Tenant Config
    await configRepo.getTenantConfig();

    // STEP 2 : Module License
    const license =
        await configRepo.getModuleLicense(
            "user_role_permission"
        );

    if (!license || Number(license.is_enabled) !== 1) {
        throw new Error("Module disabled");
    }

    let result;

    switch (payload.type) {

        case "USER":
            result = await repo.createUser(payload);
            break;

        case "ROLE":
            result = await repo.createRole(payload);
            break;

        case "PERMISSION":
            result = await repo.createPermission(payload);
            break;

        case "ROLE_PERMISSION":
            result = await repo.assignPermission(payload);
            break;

        case "USER_MACHINE":
            result = await repo.createUserMachineMapping(payload);
            break;

        default:
            throw new Error("Invalid master type");
    }

    await auditRepo.create({
        action: "CREATE",
        module: "user_role_permission",
        user_id: user.user_id,
        entity_id:
            result.user_id ||
            result.role_id ||
            result.permission_id ||
            result.mapping_id ||
            result.map_id,
        payload
    });

    return result;
}

// ==========================================================
// CONFIG
// ==========================================================

async function getConfig() {
    return repo.getConfig();
}

// ==========================================================
// MASTER
// ==========================================================

async function getMaster(type) {

    switch (type) {

        case "USER":
            return repo.getAllUsers();

        case "ROLE":
            return repo.getRoles();

        case "PERMISSION":
            return repo.getPermissions();

        case "ROLE_PERMISSION":
            return repo.getRolePermissions();

        case "USER_MACHINE":
            return repo.getUserMachineMapping();

        default:
            throw new Error("Invalid master type");
    }

}

// ==========================================================
// UPDATE MASTER
// ==========================================================

async function updateMaster(id, payload, user) {

    let result;

    switch (payload.type) {

        case "USER":
            result =
                await repo.updateUser(id, payload);
            break;

        case "ROLE":
            result =
                await repo.updateRole(id, payload);
            break;

        case "PERMISSION":
            result =
                await repo.updatePermission(id, payload);
            break;

        case "USER_MACHINE":
            result =
                await repo.updateUserMachineMapping(id, payload);
            break;

        default:
            throw new Error("Invalid master type");
    }

    await auditRepo.create({
        action: "UPDATE",
        module: "user_role_permission",
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

    return repo.getLoginLogs();

}

// ==========================================================
// EXECUTE
// ==========================================================

async function executeAction(payload, user) {

    await auditRepo.create({

        action: payload.action,

        module: "user_role_permission",

        user_id: user.user_id,

        entity_id: null,

        payload

    });

    return {

        executed: true

    };

}

// ==========================================================
// REPORT
// ==========================================================

async function getReport() {

    return repo.getReport();

}

// ==========================================================
// EXPORT
// ==========================================================

async function exportData() {

    return repo.getReport();

}

module.exports = {

    createMaster,

    getConfig,

    getMaster,

    updateMaster,

    getRuntime,

    executeAction,

    getReport,

    exportData

};