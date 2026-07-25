// src/modules/route-station-master/station.controller.js

const service = require("./station.service");
const validation = require("./station.validation");

// ==========================================================
// GET MASTER
// ==========================================================

async function getMaster(req, res, next) {

    try {

        const result =
            await service.getMaster();

        res.json({

            success: true,

            message:
                "Station master fetched successfully.",

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

            message:
                "Station fetched successfully.",

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

            message:
                "Station created successfully.",

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

            message:
                "Station updated successfully.",

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

            message:
                "Station deleted successfully.",

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

    getMaster,

    getMasterById,

    createMaster,

    updateMaster,

    deleteMaster

};
