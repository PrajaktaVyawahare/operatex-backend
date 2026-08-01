const repo = require("./company.repository");
const auditRepo = require("../../audit/audit.repository");
const configRepo = require("../../config/config.repository");

// ==========================================================
// MODULE LICENSE CHECK
// ==========================================================

async function checkModule() {

    const license = await configRepo.getModuleLicense(
        "company_master"
    );

    if (!license || Number(license.is_enabled) !== 1) {
        throw new Error("Module disabled");
    }

}

// ==========================================================
// CREATE COMPANY
// ==========================================================

async function createCompany(payload, user) {

    await checkModule();

    const tenantConfig =
        await configRepo.getTenantConfig();

    const count =
        await repo.countCompanies();

    if (count >= 1) {

        throw new Error(
            "Single installation supports only one company"
        );

    }

    const company =
        await repo.createCompany(payload);

    await auditRepo.create({

        action: "CREATE",

        module: "company_master",

        user_id: user.user_id,

        entity_id: company.company_id,

        payload

    });

    return company;

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

async function updateMaster(id, payload, user) {

    await checkModule();

    const company =
        await repo.getById(id);

    if (!company) {

        throw new Error(
            "Company not found"
        );

    }

    const updated =
        await repo.updateMaster(
            id,
            payload
        );

    

    return updated;

}

// ==========================================================
// RUNTIME
// ==========================================================

async function getRuntime() {

    await checkModule();

    return repo.getRuntime();

}

async function executeAction(payload, user) {

    await checkModule();

    await auditRepo.create({

        action: payload.action,

        module: "company_master",

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

    createCompany,

    getConfig,

    getMaster,

    updateMaster,

    getRuntime,

    executeAction,

    getReport,

    exportData

};