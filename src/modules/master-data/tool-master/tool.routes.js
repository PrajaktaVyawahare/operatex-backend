// src/modules/tool-master/tool.routes.js

const express = require("express");

const router = express.Router();

const controller =
    require("./tool.controller");

const {
    verifyJWT
} = require("../../../middleware/auth.middleware");

const {
    checkPermission
} = require("../../../middleware/permission.middleware");

// ==========================================================
// CONFIG
// ==========================================================
/*
========================================
GET /config/life
========================================
*/
router.get(
    "/config/life",
    verifyJWT,
    checkPermission("tool:view"),
    controller.getToolLife
);

/*
========================================
GET /config/calibration
========================================
*/
router.get(
    "/config/calibration",
    verifyJWT,
    checkPermission("tool:view"),
    controller.getToolCalibration
);
/*
==================================================
API0109
GET /config
==================================================
*/
router.get(
    "/config",
    verifyJWT,
    checkPermission("tool:view"),
    controller.getConfig
);

/*
==================================================
API0109A
GET /config/:id
==================================================
*/
router.get(
    "/config/:id",
    verifyJWT,
    checkPermission("tool:view"),
    controller.getConfigById
);

/*
==================================================
API0110
POST /config
==================================================
*/
router.post(
    "/config",
    verifyJWT,
    checkPermission("tool:create"),
    controller.createConfig
);

/*
==================================================
API0110A
PUT /config/:id
==================================================
*/
router.put(
    "/config/:id",
    verifyJWT,
    checkPermission("tool:update"),
    controller.updateConfig
);

/*
==================================================
API0110B
DELETE /config/:id
==================================================
*/
router.delete(
    "/config/:id",
    verifyJWT,
    checkPermission("tool:delete"),
    controller.deleteConfig
);

// ==========================================================
// MASTER
// ==========================================================

/*
==================================================
API0111
GET /master
==================================================
*/
router.get(
    "/master",
    verifyJWT,
    checkPermission("tool:view"),
    controller.getMaster
);

/*
==================================================
API0111A
GET /master/:id
==================================================
*/
router.get(
    "/master/:id",
    verifyJWT,
    checkPermission("tool:view"),
    controller.getMasterById
);

/*
==================================================
API0112
POST /master
==================================================
*/
router.post(
    "/master",
    verifyJWT,
    checkPermission("tool:create"),
    controller.createMaster
);

/*
==================================================
API0113
PUT /master/:id
==================================================
*/
router.put(
    "/master/:id",
    verifyJWT,
    checkPermission("tool:update"),
    controller.updateMaster
);

/*
==================================================
API0113A
DELETE /master/:id
==================================================
*/
router.delete(
    "/master/:id",
    verifyJWT,
    checkPermission("tool:delete"),
    controller.deleteMaster
);

// ==========================================================
// RUNTIME
// ==========================================================

/*
==================================================
API0114
GET /runtime
==================================================
*/
router.get(
    "/runtime",
    verifyJWT,
    checkPermission("tool:view"),
    controller.getRuntime
);

/*
==================================================
API0115
POST /execute
==================================================
*/
router.post(
    "/execute",
    verifyJWT,
    checkPermission("tool:execute"),
    controller.execute
);

// ==========================================================
// REPORT
// ==========================================================

/*
==================================================
API0116
GET /report
==================================================
*/
router.get(
    "/report",
    verifyJWT,
    checkPermission("tool:view"),
    controller.getReport
);

/*
==================================================
API0117
POST /export
==================================================
*/
router.post(
    "/export",
    verifyJWT,
    checkPermission("tool:export"),
    controller.exportData
);

// ==========================================================
// EXPORTS
// ==========================================================

module.exports = router;