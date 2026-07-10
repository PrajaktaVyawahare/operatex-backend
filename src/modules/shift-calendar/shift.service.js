// src/modules/shift-calendar/shift.service.js

const repo = require("./shift.repository");
const auditRepo = require("../audit/audit.repository");
const configRepo = require("../config/config.repository");

// ==========================================================
// CREATE MASTER
// ==========================================================

async function createMaster(payload, user) {

    // STEP 1 : Tenant Configuration

    await configRepo.getTenantConfig();

    // STEP 2 : Module License

    const license =
        await configRepo.getModuleLicense(
            "shift_master"
        );

    if (!license || Number(license.is_enabled) !== 1) {
        throw new Error("Module disabled");
    }

    // STEP 3 : Duplicate Shift Number

    const duplicateNo =
        await repo.checkDuplicateShiftNo(
            payload.shift_no
        );

    if (duplicateNo) {
        throw new Error(
            "Shift number already exists"
        );
    }

    // STEP 4 : Duplicate Shift Name

    const duplicateName =
        await repo.checkDuplicateShiftName(
            payload.shift_name
        );

    if (duplicateName) {
        throw new Error(
            "Shift name already exists"
        );
    }

    // STEP 5 : Validate Line

    const line =
        await repo.checkLine(
            payload.line_id
        );

    if (!line) {
        throw new Error(
            "Invalid line selected"
        );
    }

    // STEP 6 : Business Rule

    if (
        payload.shift_start_time ===
        payload.shift_end_time
    ) {
        throw new Error(
            "Shift start and end time cannot be same"
        );
    }

    // STEP 7 : Create Shift

    const shift =
        await repo.createMaster(
            payload
        );

    // STEP 8 : Audit

    await auditRepo.create({

        action: "CREATE",

        module: "shift_master",

        user_id: user.user_id,

        entity_id: shift.shift_id,

        payload

    });

    return shift;

}

// ==========================================================
// GET MASTER
// ==========================================================

async function getMaster() {

    return repo.getMaster();

}

// ==========================================================
// GET MASTER BY ID
// ==========================================================

async function getMasterById(id) {

    const shift =
        await repo.getMasterById(id);

    if (!shift) {

        throw new Error(
            "Shift not found"
        );

    }

    return shift;

}
// ==========================================================
// UPDATE MASTER
// ==========================================================

async function updateMaster(id, payload, user) {

    // STEP 1 : Check Existing Shift

    const existing =
        await repo.getMasterById(id);

    if (!existing) {
        throw new Error("Shift not found");
    }

    // STEP 2 : Duplicate Shift Number
    // Only if shift_no is updating

    if (payload.shift_no !== undefined) {

        const duplicate =
            await repo.checkDuplicateShiftNoForUpdate(
                payload.shift_no,
                id
            );

        if (duplicate) {
            throw new Error(
                "Shift number already exists"
            );
        }

    }

    // STEP 3 : Duplicate Shift Name
    // Only if shift_name is updating

    if (payload.shift_name !== undefined) {

        const duplicate =
            await repo.checkDuplicateShiftNameForUpdate(
                payload.shift_name,
                id
            );

        if (duplicate) {
            throw new Error(
                "Shift name already exists"
            );
        }

    }

    // STEP 4 : Line Validation

    if (payload.line_id !== undefined) {

        const line =
            await repo.checkLine(
                payload.line_id
            );

        if (!line) {
            throw new Error(
                "Invalid line selected"
            );
        }

    }

    // STEP 5 : Shift Time Validation

    if (
        payload.shift_start_time &&
        payload.shift_end_time &&
        payload.shift_start_time ===
        payload.shift_end_time
    ) {
        throw new Error(
            "Shift start and end time cannot be same"
        );
    }

    // STEP 6 : Dynamic Update

    const updated =
        await repo.updateMaster(
            id,
            payload
        );

    // STEP 7 : Audit Log

    await auditRepo.create({

        action: "UPDATE",

        module: "shift_master",

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

    // STEP 1 : Existing Record

    const existing =
        await repo.getMasterById(id);

    if (!existing) {

        throw new Error(
            "Shift not found"
        );

    }

    // STEP 2 : Business Rule

    if (existing.status === "INACTIVE") {

        throw new Error(
            "Shift already inactive"
        );

    }

    // STEP 3 : Soft Delete

    const deleted =
        await repo.deleteMaster(id);

    // STEP 4 : Audit

    await auditRepo.create({

        action: "DELETE",

        module: "shift_master",

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
            "shift_master"
        );

    if (!license || Number(license.is_enabled) !== 1) {

        throw new Error(
            "Module disabled"
        );

    }

    // STEP 3 : Shift Validation

    const shift =
        await repo.getMasterById(
            payload.shift_id
        );

    if (!shift) {

        throw new Error(
            "Invalid Shift"
        );

    }

    // STEP 4 : Save Configuration

    const config =
        await repo.createConfig(
            payload
        );

    // STEP 5 : Audit Log

    await auditRepo.create({

        action: "CONFIG_CREATE",

        module: "shift_calendar",

        user_id: user.user_id,

        entity_id: shift.shift_id,

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

        module: "shift_calendar",

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

        module: "shift_calendar",

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

    return await repo.getRuntime(filters);

}

// ==========================================================
// EXECUTE
// ==========================================================

async function execute(payload, user) {

    // STEP 1 : Module License

    const license =
        await configRepo.getModuleLicense(
            "shift_master"
        );

    if (!license || Number(license.is_enabled) !== 1) {

        throw new Error(
            "Module disabled"
        );

    }

    // STEP 2 : Shift Validation

    const shift =
        await repo.getMasterById(
            payload.shift_id
        );

    if (!shift) {

        throw new Error(
            "Shift not found"
        );

    }
    const runtimeData =
    await repo.getRuntimeData(payload.shift_id);

if (!runtimeData) {
    throw new Error("Shift configuration not found");
}

    // STEP 3 : Calendar Validation

  

    // STEP 4 : Execute Runtime

   const runtime =
    await repo.execute({

        shift_id: runtimeData.shift_id,

        calendar_id: runtimeData.calendar_id,

        break_id: runtimeData.break_id,

        holiday_id: runtimeData.holiday_id,

        runtime_date: new Date(),

        shift_start_time: runtimeData.shift_start_time,

        shift_end_time: runtimeData.shift_end_time,

        actual_start_time: new Date(),

        actual_end_time: null,

        runtime_status: payload.runtime_status,

        remarks: payload.remarks

    });

    // STEP 5 : Audit

    await auditRepo.create({

        action: "EXECUTE",

        module: "shift_runtime_log",

        user_id: user.user_id,

        entity_id: runtime.runtime_id,

        payload

    });

    return runtime;

}

// ==========================================================
// REPORT
// ==========================================================

async function getReport(filters) {

    return await repo.getReport(filters);

}

// ==========================================================
// EXPORT
// ==========================================================

async function exportData(filters) {

    return await repo.exportData(filters);

}

// ==========================================================
// EXPORTS
// ==========================================================

module.exports = {

    createMaster,

    getMaster,

    getMasterById,

    updateMaster,

    deleteMaster,

    getConfig,

    getConfigById,

    createConfig,

    updateConfig,

    deleteConfig,

    getRuntime,

    execute,

    getReport,

    exportData

};
