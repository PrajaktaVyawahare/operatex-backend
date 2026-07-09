const db = require("../../db/connection");
const query = require("./company.query");

async function countCompanies() {
    const result = await db.query(query.COUNT);
    return parseInt(result.rows[0].count);
}

async function createCompany(data) {
    const result = await db.query(query.CREATE, [
        data.company_code,
        data.company_name,
        data.timezone,
        data.status || "ACTIVE"
    ]);

    return result.rows[0];
}
async function getConfig() {
    const result = await db.query(
        query.GET_CONFIG
    );

    return result.rows[0];
}
async function getMaster() {
    const result = await db.query(query.GET_MASTER);
    return result.rows;
}

async function getById(id) {
    const result = await db.query(
        query.GET_BY_ID,
        [id]
    );

    return result.rows[0];
}

async function updateMaster(id, data) {
    const result = await db.query(
        query.UPDATE_MASTER,
        [
            id,
            data.company_code,
            data.company_name,
            data.timezone,
            data.status
        ]
    );

    return result.rows[0];
}

async function getRuntime() {
    const result = await db.query(
        query.GET_RUNTIME
    );

    return result.rows;
}

async function getReport() {
    const result = await db.query(
        query.GET_REPORT
    );

    return result.rows;
}

module.exports = {
       countCompanies,
    createCompany,
    getConfig,
    getMaster,
    getById,
    updateMaster,
    getRuntime,
    getReport
};