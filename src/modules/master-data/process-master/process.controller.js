// src/modules/process-master/process.controller.js

const service = require("./process.service");
const validation = require("./process.validation");

// ==========================================================
// CONFIG
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

async function createConfig(req, res, next) {

    try {

        const errors =
            validation.validateCreateConfig(
                req.body
            );

        if (errors.length) {

            return res.status(400).json({

                success: false,

                errors

            });

        }

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

async function updateConfig(req, res, next) {

    try {

        const errors =
            validation.validateUpdateConfig(
                req.body
            );

        if (errors.length) {

            return res.status(400).json({

                success: false,

                errors

            });

        }

        const result =
            await service.updateConfig(

                req.query.config_type,

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

async function deleteConfig(req, res, next) {

    try {

        const result =
            await service.deleteConfig(

                req.query.config_type,

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

            message: "Process revisions fetched successfully.",

            data: result

        });

    } catch (err) {

        next(err);

    }

}

// ==========================================================
// CONFIG - OPERATION
// ==========================================================

async function getOperations(req, res, next) {

    try {

        const result =
            await service.getOperations();

        res.json({

            success: true,

            message: "Operations fetched successfully.",

            data: result

        });

    } catch (err) {

        next(err);

    }

}

// ==========================================================
// MASTER
// ==========================================================

async function getMaster(req, res, next) {

    try {

        const result =
            await service.getMaster();

        res.json({

            success: true,

            message: "Process master fetched successfully.",

            data: result

        });

    } catch (err) {

        next(err);

    }

}

async function getMasterById(req, res, next) {

    try {

        const result =
            await service.getMasterById(
                req.params.id
            );

        res.json({

            success: true,

            message: "Process fetched successfully.",

            data: result

        });

    } catch (err) {

        next(err);

    }

}

async function createMaster(req, res, next) {

    try {

        const errors =
            validation.validateCreateMaster(
                req.body
            );

        if (errors.length) {

            return res.status(400).json({

                success: false,

                errors

            });

        }

        const result =
            await service.createMaster(

                req.body,

                req.user

            );

        res.status(201).json({

            success: true,

            message: "Process created successfully.",

            data: result

        });

    } catch (err) {

        next(err);

    }

}

async function updateMaster(req, res, next) {

    try {

        const errors =
            validation.validateUpdateMaster(
                req.body
            );

        if (errors.length) {

            return res.status(400).json({

                success: false,

                errors

            });

        }

        const result =
            await service.updateMaster(

                req.params.id,

                req.body,

                req.user

            );

        res.json({

            success: true,

            message: "Process updated successfully.",

            data: result

        });

    } catch (err) {

        next(err);

    }

}

async function deleteMaster(req, res, next) {

    try {

        const result =
            await service.deleteMaster(

                req.params.id,

                req.user

            );

        res.json({

            success: true,

            message: "Process deleted successfully.",

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

async function execute(req, res, next) {

    try {

        const errors =
            validation.validateExecute(
                req.body
            );

        if (errors.length) {

            return res.status(400).json({

                success: false,

                errors

            });

        }

        const result =
            await service.execute(

                req.body,

                req.user

            );

        res.json({

            success: true,

            message: "Runtime executed successfully.",

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

        const errors =
            validation.validateReport(
                req.query
            );

        if (errors.length) {

            return res.status(400).json({

                success: false,

                errors

            });

        }

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

async function exportData(req, res, next) {

    try {

        const errors =
            validation.validateExport(
                req.body
            );

        if (errors.length) {

            return res.status(400).json({

                success: false,

                errors

            });

        }

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

getOperations,

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