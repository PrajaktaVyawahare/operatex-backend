const db = require("../../../db/connection");
const query = require("./signal.query");


// ======================================================
// GET CONFIGURATION
// ======================================================

// ======================================================
// GET PROTOCOL CONFIG
// ======================================================

async function getProtocolConfig() {
    const result = await db.query(query.GET_PROTOCOL_CONFIG);
    return result.rows;
}

// ======================================================
// GET GATEWAY CONFIG
// ======================================================

async function getGatewayConfig() {

    const result = await db.query(query.GET_GATEWAY_CONFIG);

    return result.rows;
}


// ======================================================
// UPDATE CONFIGURATION
// ======================================================

// ======================================================
// UPDATE PROTOCOL CONFIG
// ======================================================

async function updateProtocolConfig(data) {

    const result = await db.query(
        query.UPDATE_PROTOCOL_CONFIG,
        [
    data.protocol_name,
    data.timeout,
    data.retry,
    data.polling_ms,
    data.read_function_code,
    data.write_function_code,
    data.packet_size,
    data.connection_type,
    data.description,
    data.status,
    data.protocol_id
]
    );

    return result.rows[0];
}
// ======================================================
// UPDATE GATEWAY CONFIG
// ======================================================

async function updateGatewayConfig(data) {

    const result = await db.query(
        query.UPDATE_GATEWAY_CONFIG,
        [
    data.gateway_name,
    data.gateway_code,
    data.gateway_type,
    data.broker_url,
    data.broker_port,
    data.username,
    data.password,
    data.site,
    data.location,
    data.heartbeat_interval,
    data.reconnect_interval,
    data.gateway_version,
    data.status,
    data.gateway_id
]
    );

    return result.rows[0];
}

// ======================================================
// GET MASTER
// ======================================================

const getMaster = async () => {

    const result = await db.query(query.GET_MASTER);

    return result.rows;

};

// ======================================================
// GET MASTER BY ID
// ======================================================

const getMasterById = async (id) => {

    const result = await db.query(
        query.GET_MASTER_BY_ID,
        [id]
    );

    return result.rows[0];

};

// ======================================================
// CREATE MASTER
// ======================================================

const createMaster = async (data) => {
console.log("createMaster called", data);
    const result = await db.query(
        query.CREATE_MASTER,
        [
            data.machine_id,
            data.signal_name,
            data.tag_name,
            data.protocol,
            data.address,
            data.data_type,
            data.access_type,
            data.scaling_factor,
            data.unit,
            data.status
        ]
        
    );

    return result.rows[0];

};


// ======================================================
// UPDATE MASTER
// ======================================================

const updateMaster = async (id, data) => {

    const result = await db.query(
        query.UPDATE_MASTER,
        [
            data.machine_id,
            data.signal_name,
            data.tag_name,
            data.protocol,
            data.address,
            data.data_type,
            data.access_type,
            data.scaling_factor,
            data.unit,
            data.status,
            id
        ]
    );

    return result.rows[0];

};


// ======================================================
// GET RUNTIME
// ======================================================

const getRuntime = async () => {

    const result = await db.query(query.GET_RUNTIME);

    return result.rows;

};


// ======================================================
// EXECUTE ACTION
// ======================================================

const executeAction = async (data) => {

    const result = await db.query(
        query.EXECUTE_ACTION,
        [
            data.mapping_id,
            data.raw_value,
            data.gateway_name,
            data.protocol,
            data.quality
        ]
    );

    return result.rows[0];

};


// ======================================================
// GET REPORT
// ======================================================

const getReport = async () => {

    const result = await db.query(query.GET_REPORT);

    return result.rows;

};


// ======================================================
// EXPORT DATA
// ======================================================

const exportData = async () => {

    const result = await db.query(query.EXPORT_DATA);

    return result.rows;

};

// ======================================================
// PATCH MASTER
// ======================================================

const patchMaster = async (id, payload) => {

    const fields = [];
    const values = [];
    let index = 1;

    Object.entries(payload).forEach(([key, value]) => {

        if (value !== undefined) {

            fields.push(`${key} = $${index}`);

            values.push(value);

            index++;

        }

    });

    if (fields.length === 0) {

        throw new Error("No fields provided for update");

    }

    fields.push("updated_at = NOW()");

    values.push(id);

    const sql = `
        UPDATE machine_signal_mapping
        SET ${fields.join(", ")}
        WHERE mapping_id = $${index}
        RETURNING *;
    `;

    const result = await db.query(sql, values);

    return result.rows[0];

};

// ======================================================
// DELETE MASTER (SOFT DELETE)
// ======================================================

const deleteMaster = async (id) => {

    const result = await db.query(
        query.DELETE_MASTER,
        [id]
    );

    return result.rows[0];

};

// ======================================================
// DELETE MULTIPLE MASTER
// ======================================================

const deleteMultipleMaster = async (ids) => {

    const result = await db.query(
        query.DELETE_MULTIPLE_MASTER,
        [ids]
    );

    return result.rows;

};

module.exports = {

    getProtocolConfig,
    updateProtocolConfig,

    getGatewayConfig,
    updateGatewayConfig,

    getMaster,
    getMasterById,
    createMaster,
    updateMaster,
    deleteMaster,
    deleteMultipleMaster,

    getRuntime,
    executeAction,

    getReport,
    exportData
};