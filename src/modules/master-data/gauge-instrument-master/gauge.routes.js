// src/modules/gauge-instrument-master/gauge.routes.js

const express = require("express");

const router = express.Router();

const controller =
    require("./gauge.controller");

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
==================================================
API0118
GET /config
==================================================
*/
router.get(
    "/config",
    verifyJWT,
    checkPermission("gauge:view"),
    controller.getConfig
);

router.get(
    "/config/parameter",
    verifyJWT,
    checkPermission("gauge:view"),
    controller.getParameters
);

/*
========================================
GET /config/calibration
========================================
*/
router.get(
    "/config/calibration",
    verifyJWT,
    checkPermission("gauge:view"),
    controller.getCalibrations
);
/*
==================================================
API0118A
GET /config/:id
==================================================
*/
router.get(
    "/config/:id",
    verifyJWT,
    checkPermission("gauge:view"),
    controller.getConfigById
);

/*
==================================================
API0119
POST /config
==================================================
*/
router.post(
    "/config",
    verifyJWT,
    checkPermission("gauge:create"),
    controller.createConfig
);

/*
==================================================
API0119A
PUT /config/:id
==================================================
*/
router.put(
    "/config/:id",
    verifyJWT,
    checkPermission("gauge:update"),
    controller.updateConfig
);

/*
==================================================
API0119B
DELETE /config/:id
==================================================
*/
router.delete(
    "/config/:id",
    verifyJWT,
    checkPermission("gauge:delete"),
    controller.deleteConfig
);

// ==========================================================
// MASTER
// ==========================================================

/*
==================================================
API0120
GET /master
==================================================
*/
router.get(
    "/master",
    verifyJWT,
    checkPermission("gauge:view"),
    controller.getMaster
);

/*
==================================================
API0120A
GET /master/:id
==================================================
*/
router.get(
    "/master/:id",
    verifyJWT,
    checkPermission("gauge:view"),
    controller.getMasterById
);

/*
==================================================
API0121
POST /master
==================================================
*/
router.post(
    "/master",
    verifyJWT,
    checkPermission("gauge:create"),
    controller.createMaster
);

/*
==================================================
API0122
PUT /master/:id
==================================================
*/
router.put(
    "/master/:id",
    verifyJWT,
    checkPermission("gauge:update"),
    controller.updateMaster
);

/*
==================================================
API0122A
DELETE /master/:id
==================================================
*/
router.delete(
    "/master/:id",
    verifyJWT,
    checkPermission("gauge:delete"),
    controller.deleteMaster
);

// ==========================================================
// RUNTIME
// ==========================================================

/*
==================================================
API0123
GET /runtime
==================================================
*/
router.get(
    "/runtime",
    verifyJWT,
    checkPermission("gauge:view"),
    controller.getRuntime
);
/*
========================================
GET /config/parameter

/*
==================================================
API0124
POST /execute
==================================================
*/
router.post(
    "/execute",
    verifyJWT,
    checkPermission("gauge:execute"),
    controller.execute
);

// ==========================================================
// REPORT
// ==========================================================

/*
==================================================
API0125
GET /report
==================================================
*/
router.get(
    "/report",
    verifyJWT,
    checkPermission("gauge:view"),
    controller.getReport
);

/*
==================================================
API0126
POST /export
==================================================
*/
router.post(
    "/export",
    verifyJWT,
    checkPermission("gauge:export"),
    controller.exportData
);

// ==========================================================
// EXPORTS
// ==========================================================

module.exports = router;