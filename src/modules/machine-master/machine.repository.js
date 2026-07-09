// src/modules/machine-master/machine.repository.js
const db = require("../../db/connection");

const query = require("./machine.query");

// ==========================================================
// CONFIG
// ==========================================================

async function getConfig() {
    const result = await db.query(query.GET_CONFIG);
    return result.rows;
}

// ==========================================================
// MASTER
// ==========================================================

async function getMaster() {
    const result = await db.query(query.GET_MASTER);
    return result.rows;
}

async function getMachineById(id) {
    const result = await db.query(
        query.GET_MACHINE_BY_ID,
        [id]
    );

    return result.rows[0];
}

async function createMachine(payload) {

    const values = [

        payload.machine_name,

        payload.make_model,

        payload.controller_make_model,

        payload.installed_date,

        payload.location,

        payload.communication_protocol,

        payload.tool_count,

        payload.power_rating,

        payload.no_of_spindels,

        payload.no_of_servo,

        payload.no_of_encoder,

        payload.no_of_batteries,

        payload.status,

        payload.bottleneck

    ];

    const result =
        await db.query(
            query.INSERT_MACHINE,
            values
        );

    return result.rows[0];

}

async function updateMachine(id, payload) {

    const values = [

        id,

        payload.machine_name,

        payload.make_model,

        payload.controller_make_model,

        payload.installed_date,

        payload.location,

        payload.communication_protocol,

        payload.tool_count,

        payload.power_rating,

        payload.no_of_spindels,

        payload.no_of_servo,

        payload.no_of_encoder,

        payload.no_of_batteries,

        payload.status,

        payload.bottleneck

    ];

    const result =
        await db.query(
            query.UPDATE_MACHINE,
            values
        );

    return result.rows[0];

}

// ==========================================================
// MACHINE CAPABILITY
// ==========================================================

async function getCapabilities() {

    const result =
        await db.query(
            query.GET_CAPABILITIES
        );

    return result.rows;

}

async function createCapability(payload) {

    const result =
        await db.query(
            query.INSERT_CAPABILITY,
            [

                payload.machine_id,

                payload.capability_name,

                payload.capability_value,

                payload.unit,

                payload.status,

                payload.remarks

            ]
        );

    return result.rows[0];

}

// ==========================================================
// MACHINE GROUP
// ==========================================================

async function getGroups() {

    const result =
        await db.query(
            query.GET_GROUPS
        );

    return result.rows;

}

async function createGroup(payload) {

    const result =
        await db.query(
            query.INSERT_GROUP,
            [

                payload.machine_id,

                payload.group_code,

                payload.group_name,

                payload.description,

                payload.status

            ]
        );

    return result.rows[0];

}

// ==========================================================
// RUNTIME
// ==========================================================

async function getRuntime() {

    const result =
        await db.query(
            query.GET_RUNTIME
        );

    return result.rows;

}

async function execute(payload) {

    const result =
        await db.query(
            query.INSERT_RUNTIME_EVENT,
            [

                payload.machine_id,

                payload.status,

                payload.is_available,

                payload.mode,

                payload.reason_code,

                payload.remarks

            ]
        );

    return result.rows[0];

}

// ==========================================================
// REPORT
// ==========================================================

async function getReport() {

    const result =
        await db.query(
            query.GET_REPORT
        );

    return result.rows;

}

module.exports = {

    getConfig,

    getMaster,

    getMachineById,

    createMachine,

    updateMachine,

    getCapabilities,

    createCapability,

    getGroups,

    createGroup,

    getRuntime,

    execute,

    getReport

};