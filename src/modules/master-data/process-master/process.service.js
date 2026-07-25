// src/modules/process-master/process.service.js

const repo = require("./process.repository");
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
            "process_master"
        );

    if (!license || Number(license.is_enabled) !== 1) {

        throw new Error(
            "Module disabled"
        );

    }

    // STEP 3 : Duplicate Process Code

    const duplicateCode =
        await repo.checkDuplicateProcessCode(
            payload.process_code
        );

    if (duplicateCode) {

        throw new Error(
            "Process code already exists"
        );

    }

    // STEP 4 : Duplicate Process Name

    const duplicateName =
        await repo.checkDuplicateProcessName(
            payload.process_name
        );

    if (duplicateName) {

        throw new Error(
            "Process name already exists"
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

    // STEP 6 : Validate Machine

    const machine =
        await repo.checkMachine(
            payload.machine_id
        );

    if (!machine) { 

        throw new Error(
            "Invalid Machine"
        );

    }

    // STEP 7 : Validate Operation

    const operation =
        await repo.checkOperation(
            payload.operation_id
        );

    if (!operation) {

        throw new Error(
            "Invalid Operation"
        );

    }

    // STEP 8 : Business Rule

    if (
        Number(payload.sequence_no) <= 0
    ) {

        throw new Error(
            "Invalid sequence number"
        );

    }

    if (
        Number(payload.cycle_time) <= 0
    ) {

        throw new Error(
            "Invalid cycle time"
        );

    }

    // STEP 9 : Create Process

    const process =
        await repo.createMaster(
            payload
        );

    // STEP 10 : Audit Log

    await auditRepo.create({

        action: "CREATE",

        module: "process_master",

        user_id: user.user_id,

        entity_id: process.process_id,

        payload

    });

    return process;

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

    const process =
        await repo.getMasterById(id);

    if (!process) {

        throw new Error(
            "Process not found"
        );

    }

    return process;

}

// ==========================================================
// UPDATE MASTER
// ==========================================================

async function updateMaster(id, payload, user) {

    // STEP 1 : Existing Record

    const existing =
        await repo.getMasterById(id);

    if (!existing) {

        throw new Error(
            "Process not found"
        );

    }

    // STEP 2 : Duplicate Code

    if (payload.process_code !== undefined) {

        const duplicate =
            await repo.checkDuplicateProcessCodeForUpdate(

                payload.process_code,

                id

            );

        if (duplicate) {

            throw new Error(
                "Process code already exists"
            );

        }

    }

    // STEP 3 : Duplicate Name

    if (payload.process_name !== undefined) {

        const duplicate =
            await repo.checkDuplicateProcessNameForUpdate(

                payload.process_name,

                id

            );

        if (duplicate) {

            throw new Error(
                "Process name already exists"
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

    // STEP 5 : Validate Machine

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

    // STEP 6 : Validate Operation

    if (payload.operation_id !== undefined) {

        const operation =
            await repo.checkOperation(
                payload.operation_id
            );

        if (!operation) {

            throw new Error(
                "Invalid Operation"
            );

        }

    }

    // STEP 7 : Business Rules

    if (
        payload.sequence_no !== undefined &&
        Number(payload.sequence_no) <= 0
    ) {

        throw new Error(
            "Invalid sequence number"
        );

    }

    if (
        payload.cycle_time !== undefined &&
        Number(payload.cycle_time) <= 0
    ) {

        throw new Error(
            "Invalid cycle time"
        );

    }

    // STEP 8 : Update

    const updated =
        await repo.updateMaster(
            id,
            payload
        );

    // STEP 9 : Audit

    await auditRepo.create({

        action: "UPDATE",

        module: "process_master",

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

    // STEP 1 : Existing Record

    const existing =
        await repo.getMasterById(id);

    if (!existing) {

        throw new Error(
            "Process not found"
        );

    }

    // STEP 2 : Already Deleted

    if (existing.status === "INACTIVE") {

        throw new Error(
            "Process already inactive"
        );

    }

    // STEP 3 : Soft Delete

    const deleted =
        await repo.deleteMaster(id);

    // STEP 4 : Audit

    await auditRepo.create({

        action: "DELETE",

        module: "process_master",

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
// CONFIG - REVISION
// ==========================================================

async function getRevisions() {

    return repo.getRevisions();

}

// ==========================================================
// CONFIG - OPERATION
// ==========================================================

async function getOperations() {

    return repo.getOperations();

}

// ==========================================================
// GET CONFIG BY ID
// ==========================================================

async function getConfigById(id) {

    const existing =
    await repo.getConfigById(table, id);

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
            "process_master"
        );

    if (!license || Number(license.is_enabled) !== 1) {

        throw new Error(
            "Module disabled"
        );

    }

    // STEP 3 : Validate Process

    if (
        payload.config_type &&
        payload.config_type.toUpperCase() === "REVISION"
    ) {

        const process =
            await repo.getMasterById(
                payload.process_id
            );

        if (!process) {

            throw new Error(
                "Invalid Process"
            );

        }

        if (
            payload.effective_to &&
            payload.effective_from >
            payload.effective_to
        ) {

            throw new Error(
                "effective_to must be greater than effective_from"
            );

        }

    }

    // STEP 4 : Validate Operation

    if (
        payload.config_type &&
        payload.config_type.toUpperCase() === "OPERATION"
    ) {

        if (!payload.operation_code) {

            throw new Error(
                "Operation code required"
            );

        }

        if (!payload.operation_name) {

            throw new Error(
                "Operation name required"
            );

        }

        if (!payload.operation_type) {

            throw new Error(
                "Operation type required"
            );

        }

    }

    // STEP 5 : Save Configuration

    const config =
        await repo.createConfig(
            payload
        );

    // STEP 6 : Audit Log

    await auditRepo.create({

        action: "CONFIG_CREATE",

        module: "process_master",

        user_id: user.user_id,

        entity_id:
            payload.process_id || config.operation_id,

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

    // STEP 1 : Existing Configuration

    const existing =
        await repo.getConfigById(table,id);

    if (!existing) {

        throw new Error(
            "Configuration not found"
        );

    }

    // STEP 2 : Revision Validation

    if (table === "REVISION") {

        if (
            payload.effective_from &&
            payload.effective_to &&
            payload.effective_from >
            payload.effective_to
        ) {

            throw new Error(
                "effective_to must be greater than effective_from"
            );

        }

    }

    // STEP 3 : Operation Validation

    if (table === "OPERATION") {

        if (
            payload.operation_code !== undefined &&
            payload.operation_code.trim() === ""
        ) {

            throw new Error(
                "operation_code required"
            );

        }

        if (
            payload.operation_name !== undefined &&
            payload.operation_name.trim() === ""
        ) {

            throw new Error(
                "operation_name required"
            );

        }

        if (
            payload.operation_type !== undefined &&
            payload.operation_type.trim() === ""
        ) {

            throw new Error(
                "operation_type required"
            );

        }

    }

    // STEP 4 : Dynamic Update

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

    // STEP 5 : Audit Log

    await auditRepo.create({

        action: "CONFIG_UPDATE",

        module: "process_master",

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

    // STEP 1 : Existing Configuration

    const existing =
        await repo.getConfigById(table,id);

    if (!existing) {

        throw new Error(
            "Configuration not found"
        );

    }

    // STEP 2 : Delete Configuration

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

    // STEP 3 : Audit Log

    await auditRepo.create({

        action: "CONFIG_DELETE",

        module: "process_master",

        user_id: user.user_id,

        entity_id: id,

        payload: existing

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

    // STEP 1 : Module License

    const license =
        await configRepo.getModuleLicense(
            "process_master"
        );

    if (!license || Number(license.is_enabled) !== 1) {

        throw new Error(
            "Module disabled"
        );

    }

    // STEP 2 : Validate Process

    const process =
        await repo.getMasterById(
            payload.process_id
        );

    if (!process) {

        throw new Error(
            "Process not found"
        );

    }

    // STEP 3 : Load Runtime Configuration

    const runtimeData =
        await repo.getRuntimeData(
            payload.process_id
        );

    if (!runtimeData) {

        throw new Error(
            "Process configuration not found"
        );

    }

    // STEP 4 : Execute Runtime Event

    const event =
        await repo.execute({

            process_id:
                runtimeData.process_id,

            revision_id:
                runtimeData.revision_id,

            event_type:
                payload.event_type,

            remarks:
                payload.remarks,

            created_by:
                user.user_id

        });

    // STEP 5 : Audit Log

    await auditRepo.create({

        action: "EXECUTE",

        module: "process_event",

        user_id: user.user_id,

        entity_id: event.event_id,

        payload

    });

    return event;

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

    // ======================================================
    // MASTER
    // ======================================================

    createMaster,

    getMaster,

    getMasterById,

    updateMaster,

    deleteMaster,

    // ======================================================
    // CONFIG
    // ======================================================

    getConfig,

    getConfigById,

    createConfig,

    updateConfig,

    deleteConfig,
    getRevisions,

getOperations,

    // ======================================================
    // RUNTIME
    // ======================================================

    getRuntime,

    execute,

    // ======================================================
    // REPORT
    // ======================================================

    getReport,

    exportData

};