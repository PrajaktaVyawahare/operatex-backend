const deviceService = require("./device.service");


// =====================================================
// GET CONFIGURATION
// =====================================================

const getConfig = async (req, res, next) => {

    try {

        const result = await deviceService.getConfig(
            req.query.type,
        );

        return res.status(200).json(result);

    } catch (error) {

        next(error);

    }

};


// =====================================================
// POST CONFIGURATION
// =====================================================

const updateConfig = async (req, res, next) => {

    try {

        console.log("BODY =>", req.body);
        console.log("TYPE =>", req.body?.type);

        const result = await deviceService.updateConfig(
    req.body,
    req.user
);

        return res.status(200).json(result);

    } catch (error) {

        console.log(error);

        next(error);

    }

};


// =====================================================
// GET MASTER
// =====================================================

const getMaster = async (req, res, next) => {

    try {

        const result = await deviceService.getMaster(req);

        return res.status(200).json(result);

    } catch (error) {

        next(error);

    }

};


// =====================================================
// CREATE MASTER
// =====================================================

const createMaster = async (req, res, next) => {
    

    try {

        const result = await deviceService.createMaster(
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

        const result = await deviceService.updateMaster(
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

        const result = await deviceService.getRuntime(
    req.user
);

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

       const result = await deviceService.executeAction(
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

       const result = await deviceService.getReport(
    req.user
);
        return res.status(200).json(result);

    } catch (error) {

        next(error);

    }

};


// =====================================================
// EXPORT DATA
// =====================================================

const exportData = async (req, res, next) => {

    try {

        const result = await deviceService.exportData(
    req.user
);
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

        const result = await deviceService.getMasterById(
            req.params.id
        );

        return res.status(200).json(result);

    } catch (error) {

        next(error);

    }

};

// ======================================================
// PATCH MASTER
// ======================================================

const patchMaster = async (req, res, next) => {

    try {

        const result = await deviceService.patchMaster(
            req.params.id,
            req.body,
            req.user
        );

        return res.status(200).json(result);

    } catch (error) {

        next(error);

    }

};

// ======================================================
// DELETE MASTER
// ======================================================

const deleteMaster = async (req, res, next) => {

    try {

        const result = await deviceService.deleteMaster(
            req.params.id,
            req.user
        );

        return res.status(200).json(result);

    } catch (error) {

        next(error);

    }

};

// ======================================================
// DELETE MULTIPLE MASTER
// ======================================================

const deleteMultipleMaster = async (req, res, next) => {

    try {

        const result = await deviceService.deleteMultipleMaster(
            req.body.ids,
            req.user
        );

        return res.status(200).json(result);

    } catch (error) {

        next(error);

    }

};


module.exports = {

    getConfig,

    updateConfig,

    getMaster,

    createMaster,

    updateMaster,

    getRuntime,

    executeAction,

    getReport,

    getMasterById,

    patchMaster,

    deleteMaster,

    deleteMultipleMaster,

    exportData

};