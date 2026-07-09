const service = require("./company.service");
const validator = require("./company.validation");

async function createCompany(req, res) {
    try {
        const errors = validator.validateCompany(req.body);

        if (errors.length) {
            return res.status(400).json({
                success: false,
                errors
            });
        }

        const result = await service.createCompany(
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
async function getConfig(req, res) {
    try {
        const result =
            await service.getConfig();

        res.json({
            success: true,
            data: result
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

async function getMaster(req, res) {
    try {
        const result =
            await service.getMaster();

        res.json({
            success: true,
            data: result
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

async function updateMaster(req, res) {
    try {
        const result =
            await service.updateMaster(
                req.params.id,
                req.body,
                req.user
            );

        res.json({
            success: true,
            data: result
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

async function getRuntime(req, res) {
    try {
        const result =
            await service.getRuntime();

        res.json({
            success: true,
            data: result
        });
    } catch (err) {
        res.status(500).json({
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

        res.json({
            success: true,
            data: result
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

async function getReport(req, res) {
    try {
        const result =
            await service.getReport();

        res.json({
            success: true,
            data: result
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

async function exportData(req, res) {
    try {
        const result =
            await service.exportData();

        res.json({
            success: true,
            data: result
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

module.exports = { 
    createCompany,
      getConfig,
    getMaster,
    updateMaster,
    getRuntime,
    execute,
    getReport,
    exportData
 };