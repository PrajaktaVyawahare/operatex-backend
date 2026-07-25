// src/modules/route-station-master/station.service.js

const repo = require("./station.repository");
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
            "station_master"
        );

    if (!license || Number(license.is_enabled) !== 1) {

        throw new Error(
            "Module disabled"
        );

    }

    // STEP 3 : Duplicate Station Number

    const duplicateNo =
        await repo.checkDuplicateStationNo(
            payload.station_no
        );

    if (duplicateNo) {

        throw new Error(
            "Station number already exists"
        );

    }

    // STEP 4 : Duplicate Station Name

    const duplicateName =
        await repo.checkDuplicateStationName(
            payload.station_name
        );

    if (duplicateName) {

        throw new Error(
            "Station name already exists"
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

    // STEP 6 : Create Station

    const station =
        await repo.createMaster(
            payload
        );

    // STEP 7 : Audit

    await auditRepo.create({

        action: "CREATE",

        module: "station_master",

        user_id: user.user_id,

        entity_id: station.station_id,

        payload

    });

    return station;

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

    const station =
        await repo.getMasterById(id);

    if (!station) {

        throw new Error(
            "Station not found"
        );

    }

    return station;

}

// ==========================================================
// UPDATE MASTER
// ==========================================================

async function updateMaster(id, payload, user) {

    // STEP 1 : Existing Station

    const existing =
        await repo.getMasterById(id);

    if (!existing) {

        throw new Error(
            "Station not found"
        );

    }

    // STEP 2 : Duplicate Station Number

    if (payload.station_no !== undefined) {

        const duplicate =
            await repo.checkDuplicateStationNoForUpdate(

                payload.station_no,

                id

            );

        if (duplicate) {

            throw new Error(
                "Station number already exists"
            );

        }

    }

    // STEP 3 : Duplicate Station Name

    if (payload.station_name !== undefined) {

        const duplicate =
            await repo.checkDuplicateStationNameForUpdate(

                payload.station_name,

                id

            );

        if (duplicate) {

            throw new Error(
                "Station name already exists"
            );

        }

    }

    // STEP 4 : Validate Line

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

    // STEP 5 : Update

    const updated =
        await repo.updateMaster(
            id,
            payload
        );

    // STEP 6 : Audit

    await auditRepo.create({

        action: "UPDATE",

        module: "station_master",

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

    // STEP 1 : Existing Station

    const existing =
        await repo.getMasterById(id);

    if (!existing) {

        throw new Error(
            "Station not found"
        );

    }

    // STEP 2 : Already Deleted

    if (existing.status === "INACTIVE") {

        throw new Error(
            "Station already inactive"
        );

    }

    // STEP 3 : Delete

    const deleted =
        await repo.deleteMaster(id);

    // STEP 4 : Audit

    await auditRepo.create({

        action: "DELETE",

        module: "station_master",

        user_id: user.user_id,

        entity_id: id,

        payload: existing

    });

    return deleted;

}

// ==========================================================
// EXPORTS
// ==========================================================

module.exports = {

    createMaster,

    getMaster,

    getMasterById,

    updateMaster,

    deleteMaster

};