// src/modules/part-master/part.controller.js

const service = require("./part.service");

// ==========================================================
// GET CONFIG
// ==========================================================

async function getConfig(req, res, next) {

    try {

        const result =
            await service.getConfig();

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
// GET CONFIG BY ID
// ==========================================================

async function getConfigById(req, res, next) {

    try {

        const result =
            await service.getConfigById(
                req.params.id
            );

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
// CREATE CONFIG
// ==========================================================

async function createConfig(req, res, next) {

    try {

        const result =
            await service.createConfig(

                req.body,

                req.user

            );

        res.status(201).json({

            success: true,

            message: "Configuration created successfully.",

            data: result

        });

    } catch (err) {

        next(err);

    }

}

// ==========================================================
// UPDATE CONFIG
// ==========================================================

async function updateConfig(req, res, next) {

    try {

        const result =
            await service.updateConfig(

                req.params.table,

                req.params.id,

                req.body,

                req.user

            );

        res.json({

            success: true,

            message: "Configuration updated successfully.",

            data: result

        });

    } catch (err) {

        next(err);

    }

}

// ==========================================================
// DELETE CONFIG
// ==========================================================

async function deleteConfig(req, res, next) {

    try {

        const result =
            await service.deleteConfig(

                req.params.table,

                req.params.id,

                req.user

            );

        res.json({

            success: true,

            message: "Configuration deleted successfully.",

            data: result

        });

    } catch (err) {

        next(err);

    }

}

// ==========================================================
// CONFIG - REVISION
// ==========================================================

async function getRevisions(req, res, next) {

    try {

        const result =
            await service.getRevisions();

        res.json({

            success: true,

            message: "Part revisions fetched successfully.",

            data: result

        });

    } catch (err) {

        next(err);

    }

}

// ==========================================================
// CONFIG - ATTRIBUTE
// ==========================================================

async function getAttributes(req, res, next) {

    try {

        const result =
            await service.getAttributes();

        res.json({

            success: true,

            message: "Part attributes fetched successfully.",

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
        console.log(req.body);

        const result =
            await service.createMaster(

                req.body,

                req.user

            );

        res.status(201).json({

            success: true,

            message: "Part created successfully.",

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

        const result =
            await service.getMaster();

        res.json({

            success: true,

            message: "Part master fetched successfully.",

            data: result

        });

    } catch (err) {

        next(err);

    }

}

// ==========================================================
// GET MASTER BY ID
// ==========================================================

async function getMasterById(req, res, next) {

    try {

        const result =
            await service.getMasterById(
                req.params.id
            );

        res.json({

            success: true,

            message: "Part fetched successfully.",

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

        const result =
            await service.updateMaster(

                req.params.id,

                req.body,

                req.user

            );

        res.json({

            success: true,

            message: "Part updated successfully.",

            data: result

        });

    } catch (err) {

        next(err);

    }

}

// ==========================================================
// DELETE MASTER
// ==========================================================

async function deleteMaster(req, res, next) {

    try {

        const result =
            await service.deleteMaster(

                req.params.id,

                req.user

            );

        res.json({

            success: true,

            message: "Part deleted successfully.",

            data: result

        });

    } catch (err) {

        next(err);

    }

}

// ==========================================================
// GET RUNTIME
// ==========================================================

async function getRuntime(req, res, next) {

    try {

        const result =
            await service.getRuntime(
                req.query
            );

        res.json({

            success: true,

            message: "Runtime fetched successfully.",

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

        const result =
            await service.execute(

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

        const result =
            await service.getReport(
                req.query
            );

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

        const result =
            await service.exportData(
                req.body
            );

        res.json({

            success: true,

            message: "Export generated successfully.",

            data: result

        });

    } catch (err) {

        next(err);

    }

}

// ==========================================================
// EXPORTS
// ==========================================================

module.exports = {

    // Config

    getConfig,

    getConfigById,

    createConfig,

    updateConfig,

    deleteConfig,
    getRevisions,

getAttributes,

    // Master

    createMaster,

    getMaster,

    getMasterById,

    updateMaster,

    deleteMaster,

    // Runtime

    getRuntime,

    execute,

    // Report

    getReport,

    exportData

};