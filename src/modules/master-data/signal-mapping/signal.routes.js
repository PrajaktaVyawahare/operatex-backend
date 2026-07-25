const express = require("express");
const router = express.Router();

const controller = require("./signal.controller");
const validation = require("./signal.validation");

const { verifyJWT } = require("../../../middleware/auth.middleware");
const { checkPermission } = require("../../../middleware/permission.middleware");

// ======================================================
// CONFIGURATION APIs
// ======================================================

// ==========================================================
// PROTOCOL CONFIG
// ==========================================================

router.get(
    "/config/protocol",
    verifyJWT,
    checkPermission("signal:view"),
    controller.getProtocolConfig
);

router.post(
    "/config/protocol",
    verifyJWT,
    checkPermission("signal:update"),
    controller.updateProtocolConfig
);

// ==========================================================
// GATEWAY CONFIG
// ==========================================================

router.get(
    "/config/gateway",
    verifyJWT,
    checkPermission("signal:view"),
    controller.getGatewayConfig
);

router.post(
    "/config/gateway",
    verifyJWT,
    checkPermission("signal:update"),
    controller.updateGatewayConfig
);
// ======================================================
// MASTER APIs
// ======================================================

// GET /api/signal-mapping/master

router.get(
    "/master",
    verifyJWT,
    checkPermission("signal:view"),
    controller.getMaster
);

// POST /api/signal-mapping/master

router.post(
    "/master",
    verifyJWT,
    checkPermission("signal:create"),
    validation.createMasterValidation,
    controller.createMaster
);

// PUT /api/signal-mapping/master/:id

router.put(
    "/master/:id",
    verifyJWT,
    checkPermission("signal:update"),
    validation.updateMasterValidation,
    controller.updateMaster
);

// ======================================================
// RUNTIME APIs
// ======================================================

// GET /api/signal-mapping/runtime

router.get(
    "/runtime",
    verifyJWT,
    checkPermission("signal:view"),
    controller.getRuntime
);

// ======================================================
// EXECUTE APIs
// ======================================================

// POST /api/signal-mapping/execute

router.post(
    "/execute",
    verifyJWT,
    checkPermission("signal:execute"),
    validation.executeValidation,
    controller.executeAction
);

// ======================================================
// REPORT APIs
// ======================================================

// GET /api/signal-mapping/report

router.get(
    "/report",
    verifyJWT,
    checkPermission("signal:view"),
    controller.getReport
);

// ======================================================
// EXPORT APIs
// ======================================================

// POST /api/signal-mapping/export

router.post(
    "/export",
    verifyJWT,
    checkPermission("signal:view"),
    controller.exportData
);
// PATCH /api/signal-mapping/master/:id

router.patch(
    "/master/:id",
    verifyJWT,
    checkPermission("signal:update"),
    validation.patchMasterValidation,
    controller.patchMaster
);

// DELETE /api/signal-mapping/master/:id

router.delete(
    "/master/:id",
    verifyJWT,
    checkPermission("signal:delete"),
    validation.deleteMasterValidation,
    controller.deleteMaster
);
// DELETE /api/signal-mapping/master

router.delete(
    "/master",
    verifyJWT,
    checkPermission("signal:delete"),
    validation.deleteMultipleMasterValidation,
    controller.deleteMultipleMaster
);
module.exports = router;