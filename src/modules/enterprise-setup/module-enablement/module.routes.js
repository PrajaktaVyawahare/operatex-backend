const express = require("express");
const router = express.Router();

const controller = require("./module.controller");

const { verifyJWT } = require("../../../middleware/auth.middleware");
const { checkPermission } = require("../../../middleware/permission.middleware");

// ==========================================================
// CONFIG
// ==========================================================

router.get(
    "/config",
    verifyJWT,
    checkPermission("module:view"),
    controller.getConfig
);

router.post(
    "/config",
    verifyJWT,
    checkPermission("module:update"),
    controller.updateModuleConfig
);

router.post(
    "/config/feature",
    verifyJWT,
    checkPermission("module:update"),
    controller.updateFeatureFlag
);

// ==========================================================
// MASTER
// ==========================================================

router.get(
    "/master",
    verifyJWT,
    checkPermission("module:view"),
    controller.getMaster
);

router.post(
    "/master",
    verifyJWT,
    checkPermission("module:create"),
    controller.createMaster
);

router.put(
    "/master/:id",
    verifyJWT,
    checkPermission("module:update"),
    controller.updateMaster
);

// ==========================================================
// RUNTIME
// ==========================================================

router.get(
    "/runtime",
    verifyJWT,
    checkPermission("module:view"),
    controller.getRuntime
);

// ==========================================================
// EXECUTE
// ==========================================================

router.post(
    "/execute",
    verifyJWT,
    checkPermission("module:execute"),
    controller.executeAction
);

// ==========================================================
// REPORT
// ==========================================================

router.get(
    "/report",
    verifyJWT,
    checkPermission("module:view"),
    controller.getReport
);

// ==========================================================
// EXPORT
// ==========================================================

router.post(
    "/export",
    verifyJWT,
    checkPermission("module:view"),
    controller.exportData
);

// ==========================================================
// EXPORTS
// ==========================================================

module.exports = router;