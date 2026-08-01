const service = require("./module.service");

// ==========================================================
// MASTER
// ==========================================================

async function createMaster(req, res, next) {

    try {

        const result =
            await service.createMaster(
                req.body,
                req.user
            );

        res.json({

            success: true,

            message: "Module created successfully",

            data: result

        });

    } catch (err) {

        next(err);

    }

}

async function getMaster(req, res, next) {

    try {

        const result =
            await service.getMaster();

        res.json({

            success: true,

            data: result

        });

    } catch (err) {

        next(err);

    }

}

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

            message: "Module updated successfully",

            data: result

        });

    } catch (err) {

        next(err);

    }

}

// ==========================================================
// CONFIG
// ==========================================================

async function getConfig(req, res, next) {

    try {

        const result =
            await service.getConfig(
                req.user
            );

        res.json({

            success: true,

            data: result

        });

    } catch (err) {

        next(err);

    }

}

async function updateModuleConfig(req, res, next) {

    try {

        const result =
            await service.updateModuleConfig(

                req.body,

                req.user

            );

        res.json({

            success: true,

            message: "Module updated successfully",

            data: result

        });

    } catch (err) {

        next(err);

    }

}

async function updateFeatureFlag(req, res, next) {

    try {

        const result =
            await service.updateFeatureFlag(

                req.body,

                req.user

            );

        res.json({

            success: true,

            message: "Feature updated successfully",

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
                req.user
            );

        res.json({

            success: true,

            data: result

        });

    } catch (err) {

        next(err);

    }

}

// ==========================================================
// EXECUTE
// ==========================================================

async function executeAction(req, res, next) {

    try {

        const result =
            await service.executeAction(

                req.body,

                req.user

            );

        res.json({

            success: true,

            message: "Action executed successfully",

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
                req.user
            );

        res.json({

            success: true,

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
                req.user
            );

        res.json({

            success: true,

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

    createMaster,

    getMaster,

    updateMaster,

    getConfig,

    updateModuleConfig,

    updateFeatureFlag,

    getRuntime,

    executeAction,

    getReport,

    exportData

};