// src/modules/gauge-instrument-master/gauge.service.js

const repo = require("./gauge.repository");
const auditRepo = require("../../audit/audit.repository");
const configRepo = require("../../config/config.repository");

// ==========================================================
// CREATE MASTER
// ==========================================================

async function createMaster(payload, user) {

    // STEP 1 : Tenant Configuration

    await configRepo.getTenantConfig();

    // STEP 2 : Module License

    const license =
        await configRepo.getModuleLicense(
            "gauge_master"
        );

    if (!license || Number(license.is_enabled) !== 1) {

        throw new Error(
            "Module disabled"
        );

    }

    // STEP 3 : Duplicate Gauge Number

    const duplicateNo =
        await repo.checkDuplicateGaugeNo(
            payload.gauge_no
        );

    if (duplicateNo) {

        throw new Error(
            "Gauge number already exists"
        );

    }

    // STEP 4 : Duplicate Gauge Name

    const duplicateName =
        await repo.checkDuplicateGaugeName(
            payload.gauge_name
        );

    if (duplicateName) {

        throw new Error(
            "Gauge name already exists"
        );

    }

    // STEP 5 : Business Validation

    if (

        payload.range_min !== undefined &&

        payload.range_max !== undefined &&

        Number(payload.range_min) >=
        Number(payload.range_max)

    ) {

        throw new Error(
            "Range max must be greater than range min"
        );

    }

    if (

        payload.accuracy !== undefined &&

        Number(payload.accuracy) <= 0

    ) {

        throw new Error(
            "Invalid accuracy"
        );

    }

    // STEP 6 : Create Master

    const gauge =
        await repo.createMaster(
            payload
        );

    // STEP 7 : Audit

    await auditRepo.create({

        action: "CREATE",

        module: "gauge_master",

        user_id: user.user_id,

        entity_id: gauge.gauge_id,

        payload

    });

    return gauge;

} // ==========================================================
// CONFIG - PARAMETER
// ==========================================================

async function getParameters() {

    return repo.getParameters();

}

// ==========================================================
// CONFIG - CALIBRATION
// ==========================================================

async function getCalibrations() {

    return repo.getCalibrations();

}

// ==========================================================
// GET MASTER
// ==========================================================

async function getMaster() {

    return await repo.getMaster();

}

// ==========================================================
// GET MASTER BY ID
// ==========================================================

async function getMasterById(id) {

    const gauge =
        await repo.getMasterById(id);

    if (!gauge) {

        throw new Error(
            "Gauge not found"
        );

    }

    return gauge;

}

// ==========================================================
// UPDATE MASTER
// ==========================================================

async function updateMaster(id, payload, user) {

    // STEP 1 : Existing Gauge

    const existing =
        await repo.getMasterById(id);

    if (!existing) {

        throw new Error(
            "Gauge not found"
        );

    }

    // STEP 2 : Duplicate Gauge Number

    if (payload.gauge_no !== undefined) {

        const duplicate =
            await repo.checkDuplicateGaugeNoForUpdate(

                payload.gauge_no,

                id

            );

        if (duplicate) {

            throw new Error(
                "Gauge number already exists"
            );

        }

    }

    // STEP 3 : Duplicate Gauge Name

    if (payload.gauge_name !== undefined) {

        const duplicate =
            await repo.checkDuplicateGaugeNameForUpdate(

                payload.gauge_name,

                id

            );

        if (duplicate) {

            throw new Error(
                "Gauge name already exists"
            );

        }

    }

    // STEP 4 : Business Validation

    if (

        payload.range_min !== undefined &&

        payload.range_max !== undefined &&

        Number(payload.range_min) >=
        Number(payload.range_max)

    ) {

        throw new Error(
            "Range max must be greater than range min"
        );

    }

    if (

        payload.accuracy !== undefined &&

        Number(payload.accuracy) <= 0

    ) {

        throw new Error(
            "Invalid accuracy"
        );

    }

    // STEP 5 : Update

    const updated =
        await repo.updateMaster(

            id,

            payload

        );

    // STEP 6 : Audit

    await auditRepo.create({

        action: "UPDATE",

        module: "gauge_master",

        user_id: user.user_id,

        entity_id: id,

        payload

    });

    return updated;

}

// ==========================================================
// DELETE MASTER
// ==========================================================

async function deleteMaster(id, user) {

    // STEP 1 : Existing Gauge

    const existing =
        await repo.getMasterById(id);

    if (!existing) {

        throw new Error(
            "Gauge not found"
        );

    }

    // STEP 2 : Already Inactive

    if (existing.status === "INACTIVE") {

        throw new Error(
            "Gauge already inactive"
        );

    }

    // STEP 3 : Delete

    const deleted =
        await repo.deleteMaster(id);

    // STEP 4 : Audit

    await auditRepo.create({

        action: "DELETE",

        module: "gauge_master",

        user_id: user.user_id,

        entity_id: id,

        payload: existing

    });

    return deleted;

}
// ==========================================================
// GET CONFIG
// ==========================================================

async function getConfig() {

    return await repo.getConfig();

}

// ==========================================================
// GET CONFIG BY ID
// ==========================================================

async function getConfigById(id) {

    const config =
        await repo.getConfigById(id);

    if (!config) {

        throw new Error(
            "Configuration not found"
        );

    }

    return config;

}

// ==========================================================
// CREATE CONFIG
// ==========================================================

async function createConfig(payload, user) {

    // STEP 1 : Tenant Configuration

    await configRepo.getTenantConfig();

    // STEP 2 : Module License

    const license =
        await configRepo.getModuleLicense(
            "gauge_master"
        );

    if (!license || Number(license.is_enabled) !== 1) {

        throw new Error(
            "Module disabled"
        );

    }

    // STEP 3 : Gauge Validation

    const gauge =
        await repo.checkGauge(
            payload.gauge_id || payload.asset_id
        );

    if (!gauge) {

        throw new Error(
            "Invalid Gauge"
        );

    }

    // STEP 4 : Config Validation

    switch (
        payload.config_type.toUpperCase()
    ) {

        // ==========================================
        // PARAMETER
        // ==========================================

        case "PARAMETER":

            if (

                payload.lsl !== undefined &&

                payload.usl !== undefined &&

                Number(payload.lsl) >=
                Number(payload.usl)

            ) {

                throw new Error(
                    "USL must be greater than LSL"
                );

            }

            break;

        // ==========================================
        // CALIBRATION
        // ==========================================

        case "CALIBRATION":

            if (!payload.due_date) {

                throw new Error(
                    "Due date required"
                );

            }

            if (

                payload.frequency_days !== undefined &&

                Number(payload.frequency_days) <= 0

            ) {

                throw new Error(
                    "Invalid calibration frequency"
                );

            }

            break;

        default:

            throw new Error(
                "Invalid config type"
            );

    }

    // STEP 5 : Save Configuration

    const config =
        await repo.createConfig(
            payload
        );

    // STEP 6 : Audit

    await auditRepo.create({

        action: "CONFIG_CREATE",

        module: "gauge_master",

        user_id: user.user_id,

        entity_id:
            payload.gauge_id || payload.asset_id,

        payload

    });

    return config;

}

// ==========================================================
// UPDATE CONFIG
// ==========================================================

async function updateConfig(
    table,
    id,
    payload,
    user
) {

    const updated =
        await repo.updateConfig(

            table,

            id,

            payload

        );

    if (!updated) {

        throw new Error(
            "Configuration not found"
        );

    }

    await auditRepo.create({

        action: "CONFIG_UPDATE",

        module: "gauge_master",

        user_id: user.user_id,

        entity_id: id,

        payload

    });

    return updated;

}

// ==========================================================
// DELETE CONFIG
// ==========================================================

async function deleteConfig(
    table,
    id,
    user
) {

    const deleted =
        await repo.deleteConfig(

            table,

            id

        );

    if (!deleted) {

        throw new Error(
            "Configuration not found"
        );

    }

    await auditRepo.create({

        action: "CONFIG_DELETE",

        module: "gauge_master",

        user_id: user.user_id,

        entity_id: id,

        payload: deleted

    });

    return deleted;

}
// ==========================================================
// GET RUNTIME
// ==========================================================

async function getRuntime(filters) {

    return await repo.getRuntime(
        filters
    );

}

// ==========================================================
// EXECUTE
// ==========================================================

async function execute(payload, user) {

    // STEP 1 : Module License

    const license =
        await configRepo.getModuleLicense(
            "gauge_master"
        );

    if (!license || Number(license.is_enabled) !== 1) {

        throw new Error(
            "Module disabled"
        );

    }

    // STEP 2 : Gauge Validation

    const gauge =
        await repo.checkGauge(
            payload.gauge_id || payload.asset_id
        );

    if (!gauge) {

        throw new Error(
            "Gauge not found"
        );

    }

    // STEP 3 : Event Validation

    switch (
        payload.event_type.toUpperCase()
    ) {

        // ==========================================
        // GAUGE LOG
        // ==========================================

        case "GAUGE":

            if (!payload.parameter_name) {

                throw new Error(
                    "Parameter name required"
                );

            }

            if (
                payload.measured_value === undefined
            ) {

                throw new Error(
                    "Measured value required"
                );

            }

            if (
                ![
                    "PASS",
                    "FAIL"
                ].includes(payload.result)
            ) {

                throw new Error(
                    "Invalid inspection result"
                );

            }

            break;

        // ==========================================
        // CALIBRATION EVENT
        // ==========================================

        case "CALIBRATION":

            if (
                ![
                    "PASS",
                    "FAIL"
                ].includes(payload.result)
            ) {

                throw new Error(
                    "Invalid calibration result"
                );

            }

            if (!payload.calibrated_by) {

                throw new Error(
                    "Calibrated by required"
                );

            }

            break;

        default:

            throw new Error(
                "Invalid event type"
            );

    }

    // STEP 4 : Execute Runtime Event

    const runtime =
        await repo.execute(
            payload
        );

    // STEP 5 : Audit

    await auditRepo.create({

        action: "EXECUTE",

        module: "gauge_master",

        user_id: user.user_id,

        entity_id:
            payload.gauge_id || payload.asset_id,

        payload

    });

    return runtime;

}
// ==========================================================
// REPORT
// ==========================================================

async function getReport(filters) {

    return await repo.getReport(
        filters
    );

}

// ==========================================================
// EXPORT
// ==========================================================

async function exportData(filters) {

    return await repo.exportData(
        filters
    );

}

// ==========================================================
// EXPORTS
// ==========================================================

module.exports = {

    // ======================================================
    // MASTER
    // ======================================================

    createMaster,

    getMaster,

    getMasterById,

    updateMaster,

    deleteMaster,

    // ======================================================
    // CONFIG
    // ======================================================

    getConfig,

    getConfigById,

    createConfig,

    updateConfig,

    deleteConfig,
    getParameters,

getCalibrations,

    // ======================================================
    // RUNTIME
    // ======================================================

    getRuntime,

    execute,

    // ======================================================
    // REPORT
    // ======================================================

    getReport,

    exportData

};