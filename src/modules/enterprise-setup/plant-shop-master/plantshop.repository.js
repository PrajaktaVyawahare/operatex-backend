const db = require("../../../db/connection");
const query = require("./plantshop.query");

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

async function createMaster(payload, user) {
    if (payload.type === "PLANT")
         {
            console.log("DEBUG company_id =", payload.company_id);
console.log("DEBUG user_id =", user.user_id);
console.log("DEBUG user =", user);
        const result = await db.query(
            
            query.INSERT_PLANT,
            [
                payload.company_id,
                payload.plant_code,
                payload.plant_name,
                payload.plant_type,
                payload.timezone,
                payload.state,
                payload.city,
                payload.address,
                payload.status || "ACTIVE",
                payload.remarks,
                user.user_id
            ]
        );

        return result.rows[0];
    }

    if (payload.type === "SHOP") {
        const result = await db.query(
            query.INSERT_SHOP,
            [
                payload.plant_id,
                payload.shop_code,
                payload.shop_name,
                payload.status || "ACTIVE",
                user.user_id
            ]
        );

        return result.rows[0];
    }

    throw new Error("Invalid master type");
}

async function getPlantById(id) {
    const result = await db.query(
        query.GET_PLANT_BY_ID,
        [id]
    );

    return result.rows[0];
}

async function getShopById(id) {
    const result = await db.query(
        query.GET_SHOP_BY_ID,
        [id]
    );

    return result.rows[0];
}

async function updateMaster(id, payload, user) {
      console.log("ID =", id);
    console.log("USER =", user.user_id);
    console.log("PAYLOAD =", payload);
    
  if (payload.type === "SHOP") {

    await db.query(query.UPDATE_PLANT, [
        payload.plant_id,
        payload.plant_code,
        payload.plant_name,
        payload.plant_type,
        payload.timezone,
        payload.state,
        payload.city,
        payload.address,
        payload.status,
        null,
        user.user_id
    ]);

    const result = await db.query(query.UPDATE_SHOP, [
        id,
        payload.shop_code,
        payload.shop_name,
        payload.status,
        user.user_id
    ]);

    return result.rows[0];
}

    throw new Error("Invalid master type");
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
    getConfig,
    getMaster,
    createMaster,
    getPlantById,
    getShopById,
    updateMaster,
    getRuntime,
    getReport
};