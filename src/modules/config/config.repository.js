const db = require("../../db/connection");

async function getTenantConfig() {
    const result = await db.query(
        `SELECT * FROM tenant_config LIMIT 1`
    );
    return result.rows[0];
}

async function getModuleLicense(moduleName) {
    const result = await db.query(
        `
        SELECT *
        FROM module_license_config
        WHERE module_name=$1
        `,
        [moduleName]
    );

    return result.rows[0];
}

module.exports = {
    getTenantConfig,
    getModuleLicense
};