const signalService = require("./signal.service");

// =====================================================
// GET CONFIGURATION
// =====================================================

// ==========================================================
// PROTOCOL CONFIG
// ==========================================================

async function getProtocolConfig(req, res, next) {

    try {

        const data =
            await signalService.getProtocolConfig();

        res.json({

            success: true,

            message: "Protocol configuration fetched successfully.",

            data,

            errors: [],

            meta: {}

        });

    } catch (err) {

        next(err);

    }

}

async function updateProtocolConfig(req, res, next) {

    try {

        const data =
            await signalService.updateProtocolConfig(
                req.body,
                req.user
            );

        res.json({

            success: true,

            message: "Protocol configuration updated successfully.",

            data,

            errors: [],

            meta: {}

        });

    } catch (err) {

        next(err);

    }

}

// ==========================================================
// GATEWAY CONFIG
// ==========================================================

async function getGatewayConfig(req, res, next) {

    try {

        const data =
            await signalService.getGatewayConfig();

        res.json({

            success: true,

            message: "Gateway configuration fetched successfully.",

            data,

            errors: [],

            meta: {}

        });

    } catch (err) {

        next(err);

    }

}

async function updateGatewayConfig(req, res, next) {

    try {

        const data =
            await signalService.updateGatewayConfig(
                req.body,
                req.user
            );

        res.json({

            success: true,

            message: "Gateway configuration updated successfully.",

            data,

            errors: [],

            meta: {}

        });

    } catch (err) {

        next(err);

    }

}

// =====================================================
// GET MASTER
// =====================================================

const getMaster = async (req, res, next) => {

    try {

        const result = await signalService.getMaster();

        return res.status(200).json(result);

    } catch (error) {

        next(error);

    }

};

// ======================================================
// GET MASTER BY ID
// ======================================================

const getMasterById = async (req, res, next) => {

    try {

        const result =
            await signalService.getMasterById(
                req.params.id
            );

        res.json(result);

    } catch (error) {

        next(error);

    }

};

// =====================================================
// CREATE MASTER
// =====================================================

const createMaster = async (req, res, next) => {

    try {

        const result = await signalService.createMaster(
            req.body,
            req.user
        );

        return res.status(201).json(result);

    } catch (error) {

        next(error);

    }

};


// =====================================================
// UPDATE MASTER
// =====================================================

const updateMaster = async (req, res, next) => {

    try {

        const result = await signalService.updateMaster(
            req.params.id,
            req.body,
            req.user
        );

        return res.status(200).json(result);

    } catch (error) {

        next(error);

    }

};


// =====================================================
// GET RUNTIME
// =====================================================

const getRuntime = async (req, res, next) => {

    try {

        const result = await signalService.getRuntime();

        return res.status(200).json(result);

    } catch (error) {

        next(error);

    }

};


// =====================================================
// EXECUTE ACTION
// =====================================================

const executeAction = async (req, res, next) => {

    try {

        const result = await signalService.executeAction(
            req.body,
            req.user
        );

        return res.status(200).json(result);

    } catch (error) {

        next(error);

    }

};


// =====================================================
// GET REPORT
// =====================================================

const getReport = async (req, res, next) => {

    try {

        const result =
            await signalService.getReport(req.user);

        res.status(200).json(result);

    } catch (err) {

        next(err);

    }

};


// =====================================================
// EXPORT DATA
// =====================================================

const exportData = async (req, res, next) => {
    try {

        const result = await signalService.exportData(req.user);

        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
};
// ======================================================
// PATCH MASTER
// ======================================================

const patchMaster = async (req, res, next) => {

    try {

        const result =
            await signalService.patchMaster(
                req.params.id,
                req.body,
                req.user
            );

        res.json(result);

    } catch (error) {

        next(error);

    }

};

// ======================================================
// DELETE MASTER
// ======================================================

const deleteMaster = async (req, res, next) => {

    try {

        const result =
            await signalService.deleteMaster(
                req.params.id,
                req.user
            );

        res.json(result);

    } catch (error) {

        next(error);

    }

};

// ======================================================
// DELETE MULTIPLE MASTER
// ======================================================

const deleteMultipleMaster = async (req, res, next) => {

    try {

        const result =
            await signalService.deleteMultipleMaster(
                req.body.ids,
                req.user
            );

        res.json(result);

    } catch (error) {

        next(error);

    }

};

module.exports = {

getProtocolConfig,
    updateProtocolConfig,

    getGatewayConfig,
    updateGatewayConfig,

    getMaster,

    getMasterById,

    createMaster,

    updateMaster,

    patchMaster,

    getRuntime,

    executeAction,

    getReport,

    deleteMaster,

    deleteMultipleMaster,

    exportData

};