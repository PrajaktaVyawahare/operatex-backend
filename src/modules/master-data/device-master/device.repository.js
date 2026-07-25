const db = require("../../../db/connection");
const query = require("./device.query");

// ======================================================
// GET CONFIGURATION
// ======================================================

const getConfig = async (type) => {

    if (type === "protocol") {

        const result = await db.query(
            query.GET_PROTOCOL_CONFIG
        );

        return result.rows;

    }

    if (type === "gateway") {

        const result = await db.query(
            query.GET_GATEWAY_CONFIG
        );

        return result.rows;

    }

    throw new Error("Invalid configuration type.");

};

// ======================================================
// CREATE CONFIGURATION
// ======================================================

const updateConfig = async (type, data) => {

    if (type === "protocol") {

        const result = await db.query(
            query.CREATE_PROTOCOL_CONFIG,
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
                data.status
            ]
        );

        return result.rows[0];

    }

    if (type === "gateway") {

        const result = await db.query(
            query.CREATE_GATEWAY_CONFIG,
            [
                data.company_id,
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
                data.status
            ]
        );

        return result.rows[0];

    }

    throw new Error("Invalid configuration type.");

};

// ======================================================
// GET MASTER
// ======================================================

const getMaster = async () => {

    const result = await db.query(
        query.GET_MASTER
    );

    return result.rows;

};

// ======================================================
// CREATE MASTER
// ======================================================

const createMaster = async (data) => {

    const result = await db.query(
        query.CREATE_MASTER,
        [
            data.machine_id,
            data.device_type,
            data.protocol,
            data.ip,
            data.port,
            data.slave_id,
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
            data.device_type,
            data.protocol,
            data.ip,
            data.port,
            data.slave_id,
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

    const result = await db.query(
        query.GET_RUNTIME
    );

    return result.rows;

};

// ======================================================
// EXECUTE
// ======================================================

const executeAction = async (deviceId) => {

    const result = await db.query(
        query.EXECUTE_ACTION,
        [deviceId]
    );

    return result.rows[0];

};

// ======================================================
// REPORT
// ======================================================

const getReport = async () => {

    const result = await db.query(
        query.GET_REPORT
    );

    return result.rows;

};

// ======================================================
// EXPORT
// ======================================================

const exportData = async () => {

    const result = await db.query(
        query.EXPORT_DATA
    );

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
// PATCH MASTER
// ======================================================

const patchMaster = async (id, payload) => {

    const allowedFields = [

    "machine_id",

    "device_type",

    "protocol",

    "ip",

    "port",

    "slave_id",

    "status"

];

    const fields = [];
    const values = [];

    let index = 1;

    Object.entries(payload).forEach(([key, value]) => {

        if (
            allowedFields.includes(key) &&
            value !== undefined
        ) {

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
        UPDATE device_master
        SET ${fields.join(", ")}
        WHERE device_id = $${index}
        AND status = 'ACTIVE'
        RETURNING *;
    `;

    const result = await db.query(sql, values);

    return result.rows[0];

};

// ======================================================
// DELETE MASTER
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

    getConfig,

    updateConfig,

    getMaster,

    createMaster,

    updateMaster,

    getRuntime,

    executeAction,

    getReport,

    getMasterById,

    patchMaster,

    deleteMaster,

    deleteMultipleMaster,

    exportData

};