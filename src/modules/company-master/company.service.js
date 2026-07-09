const repo = require("./company.repository");
const auditRepo = require("../audit/audit.repository");
const configRepo = require("../config/config.repository");



async function createCompany(payload, user) {

    // STEP 1: load tenant config
    const tenantConfig =
        await configRepo.getTenantConfig();

    // STEP 2: load license config
    const license =
        await configRepo.getModuleLicense(
            "company_master"
        );

   if (!license || Number(license.is_enabled) !== 1) {
    throw new Error("Module disabled");
}

    // STEP 3: business rule
    const count = await repo.countCompanies();

    if (count >= 1) {
        throw new Error(
            "Single installation supports only one company"
        );
    }

    // STEP 4: save company
    const company =
        await repo.createCompany(payload);

    // STEP 5: audit log
    
    await auditRepo.create({
    action: "CREATE",
    module: "company_master",
    user_id: user.user_id,
    entity_id: company.company_id,
    payload
});
   

    return company;
}

async function getConfig() {
    return repo.getConfig();
}

async function getMaster() {
    return repo.getMaster();
}

async function updateMaster(id, payload, user) {
    const company = await repo.getById(id);

    if (!company) {
        throw new Error("Company not found");
    }

    const updated =
        await repo.updateMaster(id, payload);

    await auditRepo.create({
        action: "UPDATE",
        module: "company_master",
        user_id: user.user_id,
        entity_id: id,
        payload
    });

    return updated;
}

async function getRuntime() {
    return repo.getRuntime();
}

async function executeAction(payload, user) {
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

async function getReport() {
    return repo.getReport();
}

async function exportData() {
    return repo.getReport();
}

module.exports = { createCompany,
     getConfig,
    getMaster,
    updateMaster,
    getRuntime,
    executeAction,
    getReport,
    exportData
 };