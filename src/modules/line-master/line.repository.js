const db = require("../../db/connection");
const query = require("./line.query");

async function getConfig() {
    const result = await db.query(
        query.GET_CONFIG
    );

    return result.rows;
}

async function getMaster() {
    const result = await db.query(
        query.GET_MASTER
    );

    return result.rows;
}

async function getById(id) {
    const result = await db.query(
        query.GET_BY_ID,
        [id]
    );

    return result.rows[0];
}

async function createMaster(payload) {

    const result = await db.query(
        query.INSERT,
        [
            payload.plant_id,
            payload.shop_id,
            payload.line_code,
            payload.line_name,
            payload.line_type,
            payload.process_type,
            payload.target_output,
            payload.takt_time_sec,
            payload.cycle_time_sec,
            payload.status || "ACTIVE",
            payload.remarks
        ]
    );

    return result.rows[0];
}

async function updateMaster(id, payload) {

    const result = await db.query(
        query.UPDATE,
        [
            id,
            payload.line_code,
            payload.line_name,
            payload.line_type,
            payload.process_type,
            payload.target_output,
            payload.takt_time_sec,
            payload.cycle_time_sec,
            payload.status,
            payload.remarks
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

async function getStations(lineId) {

    const result = await db.query(
        query.GET_STATIONS,
        [lineId]
    );

    return result.rows;
}

async function getLayouts(lineId) {

    const result = await db.query(
        query.GET_LAYOUT_BY_LINE,
        [lineId]
    );

    return result.rows;
}

async function checkDuplicateLineCode(shopId, lineCode) {

    const result = await db.query(
        `
        SELECT line_id
        FROM line_master
        WHERE shop_id=$1
        AND line_code=$2
        `,
        [
            shopId,
            lineCode
        ]
    );

    return result.rows.length > 0;
}

async function checkDefaultLayout(lineId) {

    const result = await db.query(
        `
        SELECT layout_id
        FROM layout_config
        WHERE line_id=$1
        AND is_default=true
        `,
        [lineId]
    );

    return result.rows.length > 0;
}

module.exports = {

    getConfig,

    getMaster,

    getById,

    createMaster,

    updateMaster,

    getRuntime,

    getReport,

    getStations,

    getLayouts,

    checkDuplicateLineCode,

    checkDefaultLayout

};