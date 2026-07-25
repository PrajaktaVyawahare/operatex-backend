// src/modules/shift-calendar/shift.routes.js

const express = require("express");

const router = express.Router();

const controller = require("./shift.controller");

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
API0037
GET /config
========================================
*/
router.get(
    "/config",
    verifyJWT,
    checkPermission("shift:view"),
    controller.getConfig
);

/*
========================================
API0037A
GET /config/:id
========================================
*/
router.get(
    "/config/:id",
    verifyJWT,
    checkPermission("shift:view"),
    controller.getConfigById
);

/*
========================================
API0038
POST /config
========================================
*/
router.post(
    "/config",
    verifyJWT,
    checkPermission("shift:create"),
    controller.createConfig
);

/*
========================================
API0038A
PUT /config/:id
========================================
*/
router.put(
    "/config/:id",
    verifyJWT,
    checkPermission("shift:update"),
    controller.updateConfig
);

/*
========================================
API0038B
DELETE /config/:id
========================================
*/
router.delete(
    "/config/:id",
    verifyJWT,
    checkPermission("shift:delete"),
    controller.deleteConfig
);

// ==========================================================
// MASTER
// ==========================================================

/*
========================================
API0039
GET /master
========================================
*/
router.get(
    "/master",
    verifyJWT,
    checkPermission("shift:view"),
    controller.getMaster
);

/*
========================================
API0039A
GET /master/:id
========================================
*/
router.get(
    "/master/:id",
    verifyJWT,
    checkPermission("shift:view"),
    controller.getMasterById
);

/*
========================================
API0040
POST /master
========================================
*/
router.post(
    "/master",
    verifyJWT,
    checkPermission("shift:create"),
    controller.createMaster
);

/*
========================================
API0041
PUT /master/:id
========================================
*/
router.put(
    "/master/:id",
    verifyJWT,
    checkPermission("shift:update"),
    controller.updateMaster
);

/*
========================================
API0041A
DELETE /master/:id
========================================
*/
router.delete(
    "/master/:id",
    verifyJWT,
    checkPermission("shift:delete"),
    controller.deleteMaster
);

// ==========================================================
// RUNTIME
// ==========================================================

/*
========================================
API0042
GET /runtime
========================================
*/
router.get(
    "/runtime",
    verifyJWT,
    checkPermission("shift:view"),
    controller.getRuntime
);

/*
========================================
API0043
POST /execute
========================================
*/
router.post(
    "/execute",
    verifyJWT,
    checkPermission("shift:execute"),
    controller.execute
);

// ==========================================================
// REPORT
// ==========================================================

/*
========================================
API0044
GET /report
========================================
*/
router.get(
    "/report",
    verifyJWT,
    checkPermission("shift:view"),
    controller.getReport
);

/*
========================================
API0045
POST /export
========================================
*/
router.post(
    "/export",
    verifyJWT,
    checkPermission("shift:export"),
    controller.exportData
);

module.exports = router;