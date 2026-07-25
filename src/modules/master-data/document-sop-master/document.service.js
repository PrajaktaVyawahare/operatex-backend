// src/modules/document-sop-master/document.service.js

const repo = require("./document.repository");
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
            "document_master"
        );

    if (!license || Number(license.is_enabled) !== 1) {

        throw new Error(
            "Module disabled"
        );

    }

    // STEP 3 : Duplicate Document Number

    const duplicateNo =
        await repo.checkDuplicateDocumentNo(
            payload.document_no
        );

    if (duplicateNo) {

        throw new Error(
            "Document number already exists"
        );

    }

    // STEP 4 : Duplicate Document Name

    const duplicateName =
        await repo.checkDuplicateDocumentName(
            payload.document_name
        );

    if (duplicateName) {

        throw new Error(
            "Document name already exists"
        );

    }

    // STEP 5 : Create Master

    const document =
        await repo.createMaster(
            payload
        );

    // STEP 6 : Audit

    await auditRepo.create({

        action: "CREATE",

        module: "document_master",

        user_id: user.user_id,

        entity_id: document.document_id,

        payload

    });

    return document;

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

    const document =
        await repo.getMasterById(id);

    if (!document) {

        throw new Error(
            "Document not found"
        );

    }

    return document;

}

// ==========================================================
// UPDATE MASTER
// ==========================================================

async function updateMaster(id, payload, user) {

    // STEP 1 : Existing Document

    const existing =
        await repo.getMasterById(id);

    if (!existing) {

        throw new Error(
            "Document not found"
        );

    }

    // STEP 2 : Duplicate Document Number

    if (payload.document_no !== undefined) {

        const duplicate =
            await repo.checkDuplicateDocumentNoForUpdate(

                payload.document_no,

                id

            );

        if (duplicate) {

            throw new Error(
                "Document number already exists"
            );

        }

    }

    // STEP 3 : Duplicate Document Name

    if (payload.document_name !== undefined) {

        const duplicate =
            await repo.checkDuplicateDocumentNameForUpdate(

                payload.document_name,

                id

            );

        if (duplicate) {

            throw new Error(
                "Document name already exists"
            );

        }

    }

    // STEP 4 : Update

    const updated =
        await repo.updateMaster(

            id,

            payload

        );

    // STEP 5 : Audit

    await auditRepo.create({

        action: "UPDATE",

        module: "document_master",

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

    // STEP 1 : Existing Document

    const existing =
        await repo.getMasterById(id);

    if (!existing) {

        throw new Error(
            "Document not found"
        );

    }

    // STEP 2 : Already Inactive

    if (existing.status === "INACTIVE") {

        throw new Error(
            "Document already inactive"
        );

    }

    // STEP 3 : Delete

    const deleted =
        await repo.deleteMaster(id);

    // STEP 4 : Audit

    await auditRepo.create({

        action: "DELETE",

        module: "document_master",

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
            "document_master"
        );

    if (!license || Number(license.is_enabled) !== 1) {

        throw new Error(
            "Module disabled"
        );

    }

    // STEP 3 : Document Validation

    const document =
        await repo.checkDocument(
            payload.document_id
        );

    if (!document) {

        throw new Error(
            "Invalid Document"
        );

    }

    // STEP 4 : Config Validation

    switch (
        payload.config_type.toUpperCase()
    ) {

        // ==========================================
        // REVISION
        // ==========================================

        case "REVISION":

            if (!payload.revision_no) {

                throw new Error(
                    "Revision number required"
                );

            }

            if (!payload.effective_from) {

                throw new Error(
                    "Effective from date required"
                );

            }

            break;

        // ==========================================
        // ACCESS
        // ==========================================

        case "ACCESS":

            if (!payload.role_name) {

                throw new Error(
                    "Role name required"
                );

            }

            break;

        default:

            throw new Error(
                "Invalid config type"
            );

    }

    // STEP 5 : Save Configuration

    const config =
        await repo.createConfig(
            payload
        );

    // STEP 6 : Audit

    await auditRepo.create({

        action: "CONFIG_CREATE",

        module: "document_master",

        user_id: user.user_id,

        entity_id: payload.document_id,

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

    await auditRepo.create({

        action: "CONFIG_UPDATE",

        module: "document_master",

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

    await auditRepo.create({

        action: "CONFIG_DELETE",

        module: "document_master",

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

    return await repo.getRuntime(
        filters
    );

}

// ==========================================================
// EXECUTE
// ==========================================================

async function execute(payload, user) {

    // STEP 1 : Module License

    const license =
        await configRepo.getModuleLicense(
            "document_master"
        );

    if (!license || Number(license.is_enabled) !== 1) {

        throw new Error(
            "Module disabled"
        );

    }

    // STEP 2 : Document Validation

    const document =
        await repo.checkDocument(
            payload.document_id
        );

    if (!document) {

        throw new Error(
            "Document not found"
        );

    }

    // STEP 3 : Runtime Validation

    switch (
        payload.event_type.toUpperCase()
    ) {

        // ==========================================
        // DOCUMENT VIEW
        // ==========================================

        case "VIEW":

            if (!payload.viewed_by) {

                throw new Error(
                    "Viewed By is required"
                );

            }

            if (!payload.viewed_from) {

                throw new Error(
                    "Viewed From is required"
                );

            }

            break;

        default:

            throw new Error(
                "Invalid event type"
            );

    }

    // STEP 4 : Execute Runtime Event

    const runtime =
        await repo.execute(
            payload
        );

    // STEP 5 : Audit

    await auditRepo.create({

        action: "EXECUTE",

        module: "document_master",

        user_id: user.user_id,

        entity_id: payload.document_id,

        payload

    });

    return runtime;

}
// ==========================================================
// REPORT
// ==========================================================

async function getReport(filters) {

    return await repo.getReport(
        filters
    );

}

// ==========================================================
// EXPORT
// ==========================================================

async function exportData(filters) {

    return await repo.exportData(
        filters
    );

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