// src/modules/skill-matrix/skill.service.js

const repo = require("./skill.repository");
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
            "skill_matrix"
        );

    if (!license || Number(license.is_enabled) !== 1) {

        throw new Error(
            "Module disabled"
        );

    }

    // STEP 3 : Duplicate Skill Code

    const duplicateCode =
        await repo.checkDuplicateSkillCode(
            payload.skill_code
        );

    if (duplicateCode) {

        throw new Error(
            "Skill code already exists"
        );

    }

    // STEP 4 : Duplicate Skill Name

    const duplicateName =
        await repo.checkDuplicateSkillName(
            payload.skill_name
        );

    if (duplicateName) {

        throw new Error(
            "Skill name already exists"
        );

    }

    // STEP 5 : Process Validation

    if (payload.process_id) {

        const process =
            await repo.checkProcess(
                payload.process_id
            );

        if (!process) {

            throw new Error(
                "Invalid Process"
            );

        }

    }

    // STEP 6 : Operation Validation

    if (payload.operation_id) {

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

    // STEP 7 : Create Master

    const skill =
        await repo.createMaster(
            payload
        );

    // STEP 8 : Audit

    await auditRepo.create({

        action: "CREATE",

        module: "skill_matrix",

        user_id: user.user_id,

        entity_id: skill.skill_id,

        payload

    });

    return skill;

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

    const skill =
        await repo.getMasterById(id);

    if (!skill) {

        throw new Error(
            "Skill not found"
        );

    }

    return skill;

}

// ==========================================================
// UPDATE MASTER
// ==========================================================

async function updateMaster(id, payload, user) {

    // STEP 1 : Existing Skill

    const existing =
        await repo.getMasterById(id);

    if (!existing) {

        throw new Error(
            "Skill not found"
        );

    }

    // STEP 2 : Duplicate Skill Code

    if (payload.skill_code !== undefined) {

        const duplicate =
            await repo.checkDuplicateSkillCodeForUpdate(

                payload.skill_code,

                id

            );

        if (duplicate) {

            throw new Error(
                "Skill code already exists"
            );

        }

    }

    // STEP 3 : Duplicate Skill Name

    if (payload.skill_name !== undefined) {

        const duplicate =
            await repo.checkDuplicateSkillNameForUpdate(

                payload.skill_name,

                id

            );

        if (duplicate) {

            throw new Error(
                "Skill name already exists"
            );

        }

    }

    // STEP 4 : Process Validation

    if (payload.process_id) {

        const process =
            await repo.checkProcess(
                payload.process_id
            );

        if (!process) {

            throw new Error(
                "Invalid Process"
            );

        }

    }

    // STEP 5 : Operation Validation

    if (payload.operation_id) {

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

    // STEP 6 : Update Master

    const updated =
        await repo.updateMaster(

            id,

            payload

        );

    // STEP 7 : Audit

    await auditRepo.create({

        action: "UPDATE",

        module: "skill_matrix",

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

    // STEP 1 : Existing Skill

    const existing =
        await repo.getMasterById(id);

    if (!existing) {

        throw new Error(
            "Skill not found"
        );

    }

    // STEP 2 : Already Inactive

    if (existing.status === "INACTIVE") {

        throw new Error(
            "Skill already inactive"
        );

    }

    // STEP 3 : Delete

    const deleted =
        await repo.deleteMaster(id);

    // STEP 4 : Audit

    await auditRepo.create({

        action: "DELETE",

        module: "skill_matrix",

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
// CONFIG - SKILL LEVEL
// ==========================================================

async function getLevels() {

    return repo.getLevels();

}

// ==========================================================
// CONFIG - VALIDATION
// ==========================================================

async function getValidations() {

    return repo.getValidations();

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
            "skill_matrix"
        );

    if (!license || Number(license.is_enabled) !== 1) {

        throw new Error(
            "Module disabled"
        );

    }

    // STEP 3 : Skill Validation

    const skill =
        await repo.checkSkill(
            payload.skill_id
        );

    if (!skill) {

        throw new Error(
            "Invalid Skill"
        );

    }

    // STEP 4 : Config Validation

    switch (
        payload.config_type.toUpperCase()
    ) {

        // ==========================================
        // LEVEL
        // ==========================================

        case "LEVEL":

            if (!payload.skill_level) {

                throw new Error(
                    "Skill level required"
                );

            }

            if (payload.minimum_score == null) {

                throw new Error(
                    "Minimum score required"
                );

            }

            if (payload.maximum_score == null) {

                throw new Error(
                    "Maximum score required"
                );

            }

            break;

        // ==========================================
        // CERTIFICATION
        // ==========================================

        case "CERTIFICATION":

            const userData =
                await repo.checkUser(
                    payload.user_id
                );

            if (!userData) {

                throw new Error(
                    "Invalid User"
                );

            }

            if (!payload.certificate_no) {

                throw new Error(
                    "Certificate number required"
                );

            }

            if (!payload.issue_date) {

                throw new Error(
                    "Issue date required"
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

        module: "skill_matrix",

        user_id: user.user_id,

        entity_id: payload.skill_id,

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

        module: "skill_matrix",

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

        module: "skill_matrix",

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
            "skill_matrix"
        );

    if (!license || Number(license.is_enabled) !== 1) {

        throw new Error(
            "Module disabled"
        );

    }

    // STEP 2 : Skill Validation

    const skill =
        await repo.checkSkill(
            payload.skill_id
        );

    if (!skill) {

        throw new Error(
            "Invalid Skill"
        );

    }

    // STEP 3 : User Validation

    const skillUser =
        await repo.checkUser(
            payload.user_id
        );

    if (!skillUser) {

        throw new Error(
            "Invalid User"
        );

    }

    // STEP 4 : Validator Validation

    const validator =
        await repo.checkUser(
            payload.validated_by
        );

    if (!validator) {

        throw new Error(
            "Invalid Validator"
        );

    }

    // STEP 5 : Event Validation

    switch (
        payload.event_type.toUpperCase()
    ) {

        case "VALIDATION":

            if (!payload.validation_result) {

                throw new Error(
                    "Validation result required"
                );

            }

            if (payload.score == null) {

                throw new Error(
                    "Score required"
                );

            }

            break;

        default:

            throw new Error(
                "Invalid event type"
            );

    }

    // STEP 6 : Execute Runtime Event

    const runtime =
        await repo.execute(
            payload
        );

    // STEP 7 : Audit

    await auditRepo.create({

        action: "EXECUTE",

        module: "skill_matrix",

        user_id: user.user_id,

        entity_id: payload.skill_id,

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
    getLevels,

getValidations,

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