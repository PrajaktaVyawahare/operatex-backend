const db = require("../../../db/connection");
const query = require("./module.query");

// ==========================================================
// MASTER
// ==========================================================

async function getMaster() {

    const result =
        await db.query(
            query.GET_MASTER
        );

    return result.rows;

}

async function createMaster(payload) {

    const values = [

        payload.module_name,

        payload.display_name,

        payload.module_group,

        payload.route_url,

        payload.icon,

        payload.description,

        payload.display_order,

        payload.status || "ACTIVE"

    ];

    const result =
        await db.query(
            query.CREATE_MASTER,
            values
        );

    return result.rows[0];

}

async function updateMaster(id, payload) {

    const fields = [];
    const values = [];

    Object.entries(payload).forEach(([key, value]) => {

        if (value !== undefined) {

            fields.push(key);
            values.push(value);

        }

    });

    if (!fields.length)
        return null;

    values.push(id);

    const result =
        await db.query(

            query.UPDATE_MASTER(
                fields,
                values
            ),

            values

        );

    return result.rows[0];

}

// ==========================================================
// CONFIG
// ==========================================================

async function getConfig() {

    const result =
        await db.query(

            query.GET_CONFIG,

           

        );

    return result.rows;

}
async function updateModuleLicense(payload) {

    const result =
        await db.query(

            query.UPDATE_MODULE_LICENSE,

            [

                payload.is_enabled,

                payload.module_name

            ]

        );

    return result.rows[0];

}
// ==========================================================
// FEATURE FLAG
// ==========================================================

async function getFeatureFlags() {

    const result =
        await db.query(
            query.GET_FEATURE_FLAGS
        );

    return result.rows;

}

async function updateFeatureFlag(
    featureId,
    isEnabled
) {

    const result =
        await db.query(

            query.UPDATE_FEATURE_FLAG,

            [

                isEnabled,

                featureId

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


// ==========================================================
// EXPORT
// ==========================================================

async function exportData() {

    return getReport();

}

// ==========================================================
// EXPORTS
// ==========================================================

module.exports = {

    getMaster,

    createMaster,

    updateMaster,

    getConfig,

    updateModuleLicense,

    getFeatureFlags,

    updateFeatureFlag,

    getRuntime,

    getReport,

    exportData

};