const service = require("./plantshop.service");
const validator = require("./plantshop.validation");

async function getConfig(req, res) {
    try {
        const result =
            await service.getConfig();

        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

async function getMaster(req, res) {
    try {
        const result =
            await service.getMaster();

        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

async function createMaster(req, res) {
    try {
        const errors =
            validator.validateMaster(req.body);

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

        return res.status(201).json({
            success: true,
            data: result
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

async function updateMaster(req, res) {
    try {
        const errors =
            validator.validateMaster(req.body);

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

        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

async function getRuntime(req, res) {
    try {
        const result =
            await service.getRuntime();

        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

async function execute(req, res) {
    try {
        const result =
            await service.executeAction(
                req.body,
                req.user
            );

        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

async function getReport(req, res) {
    try {
        const result =
            await service.getReport();

        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

async function exportData(req, res) {
    try {
        const result =
            await service.exportData();

        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

module.exports = {
    getConfig,
    getMaster,
    createMaster,
    updateMaster,
    getRuntime,
    execute,
    getReport,
    exportData
};