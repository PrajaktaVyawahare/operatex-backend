const repo = require("./machine.repository");
const auditRepo = require("../../audit/audit.repository");
const configRepo = require("../../config/config.repository");

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
// CONFIG - CAPABILITY
// ==========================================================

async function getCapabilityConfig() {

    return repo.getCapabilityConfig();

}

// ==========================================================
// CONFIG - GROUP
// ==========================================================

async function getGroupConfig() {

    return repo.getGroupConfig();

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

    const updatedPayload = {

        machine_name:
            payload.machine_name ?? machine.machine_name,

        make_model:
            payload.make_model ?? machine.make_model,

        controller_make_model:
            payload.controller_make_model ?? machine.controller_make_model,

        installed_date:
            payload.installed_date ?? machine.installed_date,

        location:
            payload.location ?? machine.location,

        communication_protocol:
            payload.communication_protocol ?? machine.communication_protocol,

        tool_count:
            payload.tool_count ?? machine.tool_count,

        power_rating:
            payload.power_rating ?? machine.power_rating,

        no_of_spindels:
            payload.no_of_spindels ?? machine.no_of_spindels,

        no_of_servo:
            payload.no_of_servo ?? machine.no_of_servo,

        no_of_encoder:
            payload.no_of_encoder ?? machine.no_of_encoder,

        no_of_batteries:
            payload.no_of_batteries ?? machine.no_of_batteries,

        status:
            payload.status ?? machine.status,

        bottleneck:
            payload.bottleneck ?? machine.bottleneck

    };

    const updated =
        await repo.updateMachine(
            id,
            updatedPayload
        );

    await auditRepo.create({

        action: "UPDATE",

        module: "machine_master",

        user_id: user.user_id,

        entity_id: id,

        payload

    });

    return updated;

}
async function deleteMaster(id, user) {

    const machine =
        await repo.getMachineById(id);

    if (!machine) {
        throw new Error("Machine not found");
    }

    const deleted =
        await repo.softDeleteMachine(id);

    await auditRepo.create({

        action: "DELETE",

        module: "machine_master",

        user_id: user.user_id,

        entity_id: id,

        payload: machine

    });

    return deleted;

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

async function updateCapability(id, payload, user) {

    const capability =
        await repo.getCapabilityById(id);

    if (!capability) {
        throw new Error("Capability not found");
    }

    const updatedPayload = {

        machine_id:
            payload.machine_id ?? capability.machine_id,

        capability_name:
            payload.capability_name ?? capability.capability_name,

        capability_value:
            payload.capability_value ?? capability.capability_value,

        unit:
            payload.unit ?? capability.unit,

        status:
            payload.status ?? capability.status

    };

    const updated =
        await repo.updateCapability(
            id,
            updatedPayload
        );

    await auditRepo.create({

        action: "UPDATE",

        module: "machine_capability_config",

        user_id: user.user_id,

        entity_id: id,

        payload

    });

    return updated;

}
async function deleteCapability(id, user) {

    const capability =
        await repo.getCapabilityById(id);

    if (!capability) {
        throw new Error("Capability not found");
    }

    const deleted =
        await repo.softDeleteCapability(id);

    await auditRepo.create({

        action: "DELETE",

        module: "machine_capability_config",

        user_id: user.user_id,

        entity_id: id,

        payload: capability

    });

    return deleted;

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
async function updateGroup(id, payload, user) {

    const group =
        await repo.getGroupById(id);

    if (!group) {
        throw new Error("Group not found");
    }

    const updatedPayload = {

        machine_id:
            payload.machine_id ?? group.machine_id,

        group_code:
            payload.group_code ?? group.group_code,

        group_name:
            payload.group_name ?? group.group_name,

        description:
            payload.description ?? group.description,

        status:
            payload.status ?? group.status

    };

    const updated =
        await repo.updateGroup(
            id,
            updatedPayload
        );

    await auditRepo.create({

        action: "UPDATE",

        module: "machine_group_config",

        user_id: user.user_id,

        entity_id: id,

        payload

    });

    return updated;

}
async function deleteGroup(id, user) {

    const group =
        await repo.getGroupById(id);

    if (!group) {
        throw new Error("Group not found");
    }

    const deleted =
        await repo.softDeleteGroup(id);

    await auditRepo.create({

        action: "DELETE",

        module: "machine_group_config",

        user_id: user.user_id,

        entity_id: id,

        payload: group

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
       getCapabilityConfig,

    getGroupConfig,
    


    getMaster,

    updateMaster,

    getCapabilities,

    createCapability,

    getGroups,

    createGroup,

    getRuntime,

    execute,

    getReport,

    exportData,
    deleteMaster,

updateCapability,

deleteCapability,

updateGroup,

deleteGroup,

};