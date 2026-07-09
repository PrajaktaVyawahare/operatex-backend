const service = require("./line.service");
console.log(service);
const validator = require("./line.validation");

async function getConfig(req, res) {
    try {

        const result = await service.getConfig(
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

async function updateConfig(req, res) {
    try {

        const result =
            await service.updateConfig(
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

async function getMaster(req, res) {
    try {

        const result =
            await service.getMaster(
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

async function createMaster(req, res) {
    try {

        const errors =
            validator.validateLine(
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
            validator.validateLine(
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
            await service.getRuntime(
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

async function execute(req, res) {
    try {

        const errors =
            validator.validateExecute(
                req.body
            );

        if (errors.length) {

            return res.status(400).json({
                success: false,
                errors
            });

        }

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

        const errors =
            validator.validateReport(
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

async function exportData(req, res) {
    try {

        const errors =
            validator.validateExport(
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

module.exports = {

    getConfig,

    updateConfig,

    getMaster,

    createMaster,

    updateMaster,

    getRuntime,

    execute,

    getReport,

    exportData

};