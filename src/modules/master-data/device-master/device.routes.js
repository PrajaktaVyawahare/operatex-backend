const express = require("express");
const router = express.Router();

const controller = require("./device.controller");
const validation = require("./device.validation");

const { verifyJWT } = require("../../../middleware/auth.middleware");
const { checkPermission } = require("../../../middleware/permission.middleware");

// ======================================================
// CONFIGURATION APIs
// ======================================================

// GET
// /api/device-master/config?type=protocol
// /api/device-master/config?type=gateway

router.get(
    "/config",
    verifyJWT,
    checkPermission("device:view"),
    controller.getConfig
);

// POST
// type = protocol | gateway

router.post(
    "/config",
    verifyJWT,
    checkPermission("device:update"),
    validation.configValidation,
    controller.updateConfig
);

// ======================================================
// MASTER APIs
// ======================================================

// GET MASTER

router.get(
    "/master",
    verifyJWT,
    checkPermission("device:view"),
    controller.getMaster
);

// CREATE MASTER

router.post(
    "/master",
    verifyJWT,
    checkPermission("device:create"),
    validation.createMasterValidation,
    controller.createMaster
);

// UPDATE MASTER

router.put(
    "/master/:id",
    verifyJWT,
    checkPermission("device:update"),
    validation.updateMasterValidation,
    controller.updateMaster
);

// ======================================================
// RUNTIME APIs
// ======================================================

router.get(
    "/runtime",
    verifyJWT,
    checkPermission("device:view"),
    controller.getRuntime
);

// ======================================================
// EXECUTE APIs
// ======================================================

router.post(
    "/execute",
    verifyJWT,
    checkPermission("device:execute"),
    validation.executeValidation,
    controller.executeAction
);

// ======================================================
// REPORT APIs
// ======================================================

router.get(
    "/report",
    verifyJWT,
    checkPermission("device:view"),
    controller.getReport
);

// ======================================================
// EXPORT APIs
// ======================================================

router.post(
    "/export",
    verifyJWT,
    checkPermission("device:view"),
    controller.exportData
);
router.get(
    "/master/:id",
    verifyJWT,
    checkPermission("device:view"),
    validation.getMasterByIdValidation,
    controller.getMasterById
);
router.patch(
    "/master/:id",
    verifyJWT,
    checkPermission("device:update"),
    validation.patchMasterValidation,
    controller.patchMaster
);
router.delete(
    "/master/:id",
    verifyJWT,
    checkPermission("device:delete"),
    validation.deleteMasterValidation,
    controller.deleteMaster
);
router.delete(
    "/master",
    verifyJWT,
    checkPermission("device:delete"),
    validation.deleteMultipleMasterValidation,
    controller.deleteMultipleMaster
);
module.exports = router;