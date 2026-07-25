// src/modules/part-master/part.service.js

const repo = require("./part.repository");
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
            "part_master"
        );

    if (!license || Number(license.is_enabled) !== 1) {

        throw new Error("Module disabled");

    }

    // STEP 3 : Duplicate Part Code

    const duplicateCode =
        await repo.checkDuplicatePartCode(
            payload.part_code
        );

    if (duplicateCode) {

        throw new Error(
            "Part code already exists"
        );

    }

    // STEP 4 : Duplicate Part Name

    const duplicateName =
        await repo.checkDuplicatePartName(
            payload.part_name
        );

    if (duplicateName) {

        throw new Error(
            "Part name already exists"
        );

    }

    // STEP 5 : Business Rule

    if (
        payload.takt_time &&
        Number(payload.takt_time) <= 0
    ) {

        throw new Error(
            "Invalid takt time"
        );

    }

    // STEP 6 : Save

    const part =
        await repo.createMaster(
            payload
        );

    // STEP 7 : Audit

    await auditRepo.create({

        action: "CREATE",

        module: "part_master",

        user_id: user.user_id,

        entity_id: part.part_id,

        payload

    });

    return part;

}

// ==========================================================
// GET MASTER
// ==========================================================

async function getMaster() {

    return await repo.getMaster();

}

// ==========================================================
// CONFIG - REVISION
// ==========================================================

async function getRevisions() {

    return repo.getRevisions();

}

// ==========================================================
// CONFIG - ATTRIBUTE
// ==========================================================

async function getAttributes() {

    return repo.getAttributes();

}

// ==========================================================
// GET MASTER BY ID
// ==========================================================

async function getMasterById(id) {

    const part =
        await repo.getMasterById(id);

    if (!part) {

        throw new Error(
            "Part not found"
        );

    }

    return part;

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
            "Part not found"
        );

    }

    // STEP 2 : Duplicate Code

    if (payload.part_code !== undefined) {

        const duplicate =
            await repo.checkDuplicatePartCodeForUpdate(

                payload.part_code,

                id

            );

        if (duplicate) {

            throw new Error(
                "Part code already exists"
            );

        }

    }

    // STEP 3 : Duplicate Name

    if (payload.part_name !== undefined) {

        const duplicate =
            await repo.checkDuplicatePartNameForUpdate(

                payload.part_name,

                id

            );

        if (duplicate) {

            throw new Error(
                "Part name already exists"
            );

        }

    }

    // STEP 4 : Business Rule

    if (
        payload.takt_time !== undefined &&
        Number(payload.takt_time) <= 0
    ) {

        throw new Error(
            "Invalid takt time"
        );

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

        module: "part_master",

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
            "Part not found"
        );

    }

    // STEP 2 : Already Deleted

    if (existing.status === "INACTIVE") {

        throw new Error(
            "Part already inactive"
        );

    }

    // STEP 3 : Soft Delete

    const deleted =
        await repo.deleteMaster(id);

    // STEP 4 : Audit

    await auditRepo.create({

        action: "DELETE",

        module: "part_master",

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
            "part_master"
        );

    if (!license || Number(license.is_enabled) !== 1) {

        throw new Error(
            "Module disabled"
        );

    }

    // STEP 3 : Validate Part

    const part =
        await repo.getMasterById(
            payload.part_id
        );

    if (!part) {

        throw new Error(
            "Invalid Part"
        );

    }

    // STEP 4 : Revision Validation

    if (
        payload.config_type &&
        payload.config_type.toUpperCase() === "REVISION"
    ) {

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

    // STEP 5 : Attribute Validation

    if (
        payload.config_type &&
        payload.config_type.toUpperCase() === "ATTRIBUTE"
    ) {

        if (
            !payload.attribute_key ||
            !payload.attribute_value
        ) {

            throw new Error(
                "Attribute key and value required"
            );

        }

    }

    // STEP 6 : Save Configuration

    const config =
        await repo.createConfig(
            payload
        );

    // STEP 7 : Audit Log

    await auditRepo.create({

        action: "CONFIG_CREATE",

        module: "part_master",

        user_id: user.user_id,

        entity_id: part.part_id,

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

    // STEP 1 : Check Existing Configuration

   const existing = await repo.getConfigById(table, id);

    if (!existing) {

        throw new Error(
            "Configuration not found"
        );

    }

    // STEP 2 : Revision Validation

    if (
        table === "REVISION"
    ) {

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

    // STEP 3 : Attribute Validation

    if (
        table === "ATTRIBUTE"
    ) {

        if (
            payload.attribute_key !== undefined &&
            payload.attribute_key.trim() === ""
        ) {

            throw new Error(
                "attribute_key required"
            );

        }

        if (
            payload.attribute_value !== undefined &&
            payload.attribute_value.trim() === ""
        ) {

            throw new Error(
                "attribute_value required"
            );

        }

    }

    // STEP 4 : Update Configuration

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

        module: "part_master",

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

    // STEP 1 : Check Existing Configuration

   const existing = await repo.getConfigById(table, id);

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

        module: "part_master",

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
            "part_master"
        );

    if (!license || Number(license.is_enabled) !== 1) {

        throw new Error(
            "Module disabled"
        );

    }

    // STEP 2 : Validate Part

    const part =
        await repo.getMasterById(
            payload.part_id
        );

    if (!part) {

        throw new Error(
            "Part not found"
        );

    }

    // STEP 3 : Load Runtime Data

    const runtimeData =
        await repo.getRuntimeData(
            payload.part_id
        );

    if (!runtimeData) {

        throw new Error(
            "Part configuration not found"
        );

    }

    // STEP 4 : Execute Event

    const event =
        await repo.execute({

            part_id:
                runtimeData.part_id,

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

        module: "part_event",

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

    exportData,
    getRevisions,

getAttributes,

};