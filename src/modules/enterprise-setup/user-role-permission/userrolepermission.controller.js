// src/modules/user-role-permission/userRolePermission.controller.js

const service = require("./userRolePermission.service");

// ==========================================================
// CONFIG
// ==========================================================

async function getConfig(req, res, next) {
    try {

        const result = await service.getConfig();

        res.json({
            success: true,
            message: "Configuration fetched successfully.",
            data: result
        });

    } catch (err) {
        next(err);
    }
}

// ==========================================================
// CREATE MASTER
// ==========================================================

async function createMaster(req, res, next) {

    try {

        const result = await service.createMaster(
            req.body,
            req.user
        );

        res.status(201).json({

            success: true,

            message: "Record created successfully.",

            data: result

        });

    } catch (err) {

        next(err);

    }

}

// ==========================================================
// GET MASTER
// ==========================================================

async function getMaster(req, res, next) {

    try {

        const result = await service.getMaster(
            req.query.type
        );

        res.json({

            success: true,

            message: "Master data fetched successfully.",

            data: result

        });

    } catch (err) {

        next(err);

    }

}

// ==========================================================
// UPDATE MASTER
// ==========================================================

async function updateMaster(req, res, next) {

    try {

        const result = await service.updateMaster(

            req.params.id,

            req.body,

            req.user

        );

        res.json({

            success: true,

            message: "Record updated successfully.",

            data: result

        });

    } catch (err) {

        next(err);

    }

}

// ==========================================================
// RUNTIME
// ==========================================================

async function getRuntime(req, res, next) {

    try {

        const result = await service.getRuntime();

        res.json({

            success: true,

            message: "Runtime data fetched successfully.",

            data: result

        });

    } catch (err) {

        next(err);

    }

}

// ==========================================================
// EXECUTE
// ==========================================================

async function execute(req, res, next) {

    try {

        const result = await service.executeAction(

            req.body,

            req.user

        );

        res.json({

            success: true,

            message: "Action executed successfully.",

            data: result

        });

    } catch (err) {

        next(err);

    }

}

// ==========================================================
// REPORT
// ==========================================================

async function getReport(req, res, next) {

    try {

        const result = await service.getReport();

        res.json({

            success: true,

            message: "Report fetched successfully.",

            data: result

        });

    } catch (err) {

        next(err);

    }

}

// ==========================================================
// EXPORT
// ==========================================================

async function exportData(req, res, next) {

    try {

        const result = await service.exportData();

        res.json({

            success: true,

            message: "Export generated successfully.",

            data: result

        });

    } catch (err) {

        next(err);

    }

}

module.exports = {

    getConfig,
    
    createMaster,

    getMaster,

    updateMaster,

    getRuntime,

    execute,

    getReport,

    exportData

};