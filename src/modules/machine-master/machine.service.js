const repo = require("./machine.repository");
const auditRepo = require("../audit/audit.repository");
const configRepo = require("../config/config.repository");

// ==========================================================
// CREATE MACHINE
// ==========================================================

async function createMaster(payload, user) {

    // STEP 1 : Tenant Config
    await configRepo.getTenantConfig();

    // STEP 2 : Module License
    const license =
        await configRepo.getModuleLicense(
            "machine_master"
        );

    if (!license || Number(license.is_enabled) !== 1) {
        throw new Error("Module disabled");
    }

    const machine =
        await repo.createMachine(payload);

    await auditRepo.create({

        action: "CREATE",

        module: "machine_master",

        user_id: user.user_id,

        entity_id: machine.machine_id,

        payload

    });

    return machine;

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

async function getMaster() {

    return repo.getMaster();

}

// ==========================================================
// UPDATE MACHINE
// ==========================================================

async function updateMaster(id, payload, user) {

    const machine =
        await repo.getMachineById(id);

    if (!machine) {
        throw new Error("Machine not found");
    }

    const updated =
        await repo.updateMachine(id, payload);

    await auditRepo.create({

        action: "UPDATE",

        module: "machine_master",

        user_id: user.user_id,

        entity_id: id,

        payload

    });

    return updated;

}

// ==========================================================
// MACHINE CAPABILITY
// ==========================================================

async function getCapabilities() {

    return repo.getCapabilities();

}

async function createCapability(payload, user) {

    const capability =
        await repo.createCapability(payload);

    await auditRepo.create({

        action: "CREATE",

        module: "machine_capability_config",

        user_id: user.user_id,

        entity_id: capability.capability_id,

        payload

    });

    return capability;

}

// ==========================================================
// MACHINE GROUP
// ==========================================================

async function getGroups() {

    return repo.getGroups();

}

async function createGroup(payload, user) {

    const group =
        await repo.createGroup(payload);

    await auditRepo.create({

        action: "CREATE",

        module: "machine_group_config",

        user_id: user.user_id,

        entity_id: group.group_id,

        payload

    });

    return group;

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

async function execute(payload, user) {

    const event =
        await repo.execute(payload);

    await auditRepo.create({

        action: payload.status,

        module: "machine_status_event",

        user_id: user.user_id,

        entity_id: event.event_id,

        payload

    });

    return event;

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

    getCapabilities,

    createCapability,

    getGroups,

    createGroup,

    getRuntime,

    execute,

    getReport,

    exportData

};