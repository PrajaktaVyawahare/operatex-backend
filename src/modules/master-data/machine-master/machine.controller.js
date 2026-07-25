// src/modules/machine-master/machine.controller.js

const service = require("./machine.service");

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
// CONFIG - CAPABILITY
// ==========================================================

async function getCapabilityConfig(req, res, next) {

    try {

        const result =
            await service.getCapabilityConfig();

        res.json({

            success: true,

            message: "Machine capability configuration fetched successfully.",

            data: result

        });

    } catch (err) {

        next(err);

    }

}

// ==========================================================
// CONFIG - GROUP
// ==========================================================

async function getGroupConfig(req, res, next) {

    try {

        const result =
            await service.getGroupConfig();

        res.json({

            success: true,

            message: "Machine group configuration fetched successfully.",

            data: result

        });

    } catch (err) {

        next(err);

    }

}

// ==========================================================
// MASTER
// ==========================================================

async function  createMaster(req, res, next) {

    try {

        const result = await service.createMaster(
            req.body,
            req.user
        );

        res.status(201).json({

            success: true,

            message: "Machine created successfully.",

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

            message: "Machine master fetched successfully.",

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

            message: "Machine updated successfully.",

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

            message: "Machine deleted successfully.",

            data: result

        });

    } catch (err) {

        next(err);

    }

}
async function createConfig(req, res, next) {

    try {

        let result;

        if (req.body.type === "CAPABILITY") {

            result =
                await service.createCapability(
                    req.body,
                    req.user
                );

        } else if (req.body.type === "GROUP") {

            result =
                await service.createGroup(
                    req.body,
                    req.user
                );

        } else {

            throw new Error("Invalid config type");

        }

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

        let result;

        if (req.params.type === "capability") {

            result =
                await service.updateCapability(

                    req.params.id,

                    req.body,

                    req.user

                );

        } else if (req.params.type === "group") {

            result =
                await service.updateGroup(

                    req.params.id,

                    req.body,

                    req.user

                );

        } else {

            throw new Error("Invalid config type");

        }

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

        let result;

        if (req.params.type === "capability") {

            result =
                await service.deleteCapability(

                    req.params.id,

                    req.user

                );

        } else if (req.params.type === "group") {

            result =
                await service.deleteGroup(

                    req.params.id,

                    req.user

                );

        } else {

            throw new Error("Invalid config type");

        }

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
// RUNTIME
// ==========================================================

async function getRuntime(req, res, next) {

    try {

        const result =
            await service.getRuntime();

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

        const result =
            await service.execute(

                req.body,

                req.user

            );

        res.json({

            success: true,

            message: "Machine action executed successfully.",

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
            await service.getReport();

        res.json({

            success: true,

            message: "Machine report fetched successfully.",

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
            await service.exportData();

        res.json({

            success: true,

            message: "Machine export generated successfully.",

            data: result

        });

    } catch (err) {

        next(err);

    }

}

module.exports = {

    createMaster,
    getCapabilityConfig,

    getGroupConfig,

    getConfig,

    getMaster,

    updateMaster,

    getRuntime,

    execute,

    getReport,

    exportData,
    createConfig,

updateConfig,

deleteConfig,

deleteMaster,

};