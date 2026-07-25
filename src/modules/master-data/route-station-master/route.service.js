// src/modules/route-station-master/route.service.js

const repo = require("./route.repository");
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
            "route_master"
        );

    if (!license || Number(license.is_enabled) !== 1) {

        throw new Error(
            "Module disabled"
        );

    }

    // STEP 3 : Duplicate Route Code

    const duplicateCode =
        await repo.checkDuplicateRouteCode(
            payload.route_code
        );

    if (duplicateCode) {

        throw new Error(
            "Route code already exists"
        );

    }

    // STEP 4 : Duplicate Route Name

    const duplicateName =
        await repo.checkDuplicateRouteName(
            payload.route_name
        );

    if (duplicateName) {

        throw new Error(
            "Route name already exists"
        );

    }

    // STEP 5 : Validate Part

    const part =
        await repo.checkPart(
            payload.part_id
        );

    if (!part) {

        throw new Error(
            "Invalid Part"
        );

    }

    // STEP 6 : Business Validation

    if (
        payload.route_code.trim().length < 3
    ) {

        throw new Error(
            "Invalid route code"
        );

    }

    if (
        payload.route_name.trim().length < 3
    ) {

        throw new Error(
            "Invalid route name"
        );

    }

    // STEP 7 : Create Master

    const route =
        await repo.createMaster(
            payload
        );

    // STEP 8 : Audit

    await auditRepo.create({

        action: "CREATE",

        module: "route_master",

        user_id: user.user_id,

        entity_id: route.route_id,

        payload

    });

    return route;

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

    const route =
        await repo.getMasterById(id);

    if (!route) {

        throw new Error(
            "Route not found"
        );

    }

    return route;

}

// ==========================================================
// UPDATE MASTER
// ==========================================================

async function updateMaster(id, payload, user) {

    // STEP 1 : Existing Route

    const existing =
        await repo.getMasterById(id);

    if (!existing) {

        throw new Error(
            "Route not found"
        );

    }

    // STEP 2 : Duplicate Route Code

    if (payload.route_code !== undefined) {

        const duplicate =
            await repo.checkDuplicateRouteCodeForUpdate(

                payload.route_code,

                id

            );

        if (duplicate) {

            throw new Error(
                "Route code already exists"
            );

        }

    }

    // STEP 3 : Duplicate Route Name

    if (payload.route_name !== undefined) {

        const duplicate =
            await repo.checkDuplicateRouteNameForUpdate(

                payload.route_name,

                id

            );

        if (duplicate) {

            throw new Error(
                "Route name already exists"
            );

        }

    }

    // STEP 4 : Validate Part

    if (payload.part_id !== undefined) {

        const part =
            await repo.checkPart(
                payload.part_id
            );

        if (!part) {

            throw new Error(
                "Invalid Part"
            );

        }

    }

    // STEP 5 : Update

    const updated =
        await repo.updateMaster(
            id,
            payload
        );

    // STEP 6 : Audit

    await auditRepo.create({

        action: "UPDATE",

        module: "route_master",

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

    // STEP 1 : Existing Route

    const existing =
        await repo.getMasterById(id);

    if (!existing) {

        throw new Error(
            "Route not found"
        );

    }

    // STEP 2 : Already Deleted

    if (existing.status === "INACTIVE") {

        throw new Error(
            "Route already inactive"
        );

    }

    // STEP 3 : Soft Delete

    const deleted =
        await repo.deleteMaster(id);

    // STEP 4 : Audit

    await auditRepo.create({

        action: "DELETE",

        module: "route_master",

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
            "route_master"
        );

    if (!license || Number(license.is_enabled) !== 1) {

        throw new Error(
            "Module disabled"
        );

    }

    // STEP 3 : Validate Config Type

    switch (payload.config_type.toUpperCase()) {

        // ==========================================
        // ROUTE STEP
        // ==========================================

        case "STEP": {

            const route =
                await repo.getMasterById(
                    payload.route_id
                );

            if (!route) {

                throw new Error(
                    "Invalid Route"
                );

            }

            const station =
                await repo.checkStation(
                    payload.station_id
                );

            if (!station) {

                throw new Error(
                    "Invalid Station"
                );

            }

            const machine =
                await repo.checkMachine(
                    payload.machine_id
                );

            if (!machine) {

                throw new Error(
                    "Invalid Machine"
                );

            }

            const operation =
                await repo.checkOperation(
                    payload.operation_id
                );

            if (!operation) {

                throw new Error(
                    "Invalid Operation"
                );

            }

            break;

        }

        // ==========================================
        // ROUTE VALIDATION
        // ==========================================

        case "VALIDATION": {

            const runtime =
                await repo.getRuntimeData(
                    payload.route_step_id
                );

            if (!runtime) {

                throw new Error(
                    "Invalid Route Step"
                );

            }

            break;

        }

        default:

            throw new Error(
                "Invalid config type"
            );

    }

    // STEP 4 : Save Configuration

    const config =
        await repo.createConfig(
            payload
        );

    // STEP 5 : Audit

    await auditRepo.create({

        action: "CONFIG_CREATE",

        module: "route_master",

        user_id: user.user_id,

        entity_id:

            payload.route_id ||

            payload.route_step_id,

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

    // STEP 1 : Update Configuration

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

    // STEP 2 : Audit

    await auditRepo.create({

        action: "CONFIG_UPDATE",

        module: "route_master",

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

    // STEP 1 : Delete Configuration

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

    // STEP 2 : Audit

    await auditRepo.create({

        action: "CONFIG_DELETE",

        module: "route_master",

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

    return await repo.getRuntime(filters);

}

// ==========================================================
// EXECUTE
// ==========================================================

async function execute(payload, user) {

    // STEP 1 : Tenant Configuration

    await configRepo.getTenantConfig();

    // STEP 2 : Module License

    const license =
        await configRepo.getModuleLicense(
            "route_master"
        );

    if (!license || Number(license.is_enabled) !== 1) {

        throw new Error(
            "Module disabled"
        );

    }

    // STEP 3 : Validate Route

    const route =
        await repo.getMasterById(
            payload.route_id
        );

    if (!route) {

        throw new Error(
            "Invalid Route"
        );

    }

    // STEP 4 : Load Runtime Data

    const runtime =
        await repo.getRuntimeData(
            payload.route_id
        );

    if (!runtime) {

        throw new Error(
            "Route configuration not found"
        );

    }

    // STEP 5 : Execute Runtime

    const result =
        await repo.execute({

            route_id: payload.route_id,

            route_step_id:
                payload.route_step_id ||
                runtime.route_step_id,

            station_id:
                payload.station_id ||
                runtime.station_id,

            machine_id:
                payload.machine_id ||
                runtime.machine_id,

            event_type:
                payload.event_type,

            remarks:
                payload.remarks,

            created_by:
                user.user_id

        });

    // STEP 6 : Audit

    await auditRepo.create({

        action: "EXECUTE",

        module: "route_execution_event",

        user_id: user.user_id,

        entity_id: result.event_id,

        payload

    });

    return result;

}

// ==========================================================
// REPORT
// ==========================================================

async function getReport(filters) {

    return await repo.getReport(filters);

}

// ==========================================================
// EXPORT
// ==========================================================

async function exportData(filters) {

    return await repo.exportData(filters);

}

// ==========================================================
// EXPORTS
// ==========================================================

module.exports = {

    // Config

    getConfig,

    getConfigById,

    createConfig,

    updateConfig,

    deleteConfig,

    // Master

    createMaster,

    getMaster,

    getMasterById,

    updateMaster,

    deleteMaster,

    // Runtime

    getRuntime,

    execute,

    // Report

    getReport,

    exportData

};