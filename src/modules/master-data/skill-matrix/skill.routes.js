// src/modules/skill-matrix/skill.routes.js

const express = require("express");

const router = express.Router();

const controller =
    require("./skill.controller");

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
API0136
GET /config
==================================================
*/
router.get(
    "/config",
    verifyJWT,
    checkPermission("skill:view"),
    controller.getConfig
);

/*
==================================================
API0137
GET /config/:id
==================================================
*/
router.get(
    "/config/:id",
    verifyJWT,
    checkPermission("skill:view"),
    controller.getConfigById
);

/*
==================================================
API0138
POST /config
==================================================
*/
router.post(
    "/config",
    verifyJWT,
    checkPermission("skill:create"),
    controller.createConfig
);

/*
==================================================
API0139
PUT /config/:id
==================================================
*/
router.put(
    "/config/:id",
    verifyJWT,
    checkPermission("skill:update"),
    controller.updateConfig
);

/*
==================================================
API0140
DELETE /config/:id
==================================================
*/
router.delete(
    "/config/:id",
    verifyJWT,
    checkPermission("skill:delete"),
    controller.deleteConfig
);

// ==========================================================
// MASTER
// ==========================================================

/*
==================================================
API0141
GET /master
==================================================
*/
router.get(
    "/master",
    verifyJWT,
    checkPermission("skill:view"),
    controller.getMaster
);

/*
==================================================
API0142
GET /master/:id
==================================================
*/
router.get(
    "/master/:id",
    verifyJWT,
    checkPermission("skill:view"),
    controller.getMasterById
);

/*
==================================================
API0143
POST /master
==================================================
*/
router.post(
    "/master",
    verifyJWT,
    checkPermission("skill:create"),
    controller.createMaster
);

/*
==================================================
API0144
PUT /master/:id
==================================================
*/
router.put(
    "/master/:id",
    verifyJWT,
    checkPermission("skill:update"),
    controller.updateMaster
);

/*
==================================================
API0145
DELETE /master/:id
==================================================
*/
router.delete(
    "/master/:id",
    verifyJWT,
    checkPermission("skill:delete"),
    controller.deleteMaster
);

// ==========================================================
// RUNTIME
// ==========================================================

/*
==================================================
API0146
GET /runtime
==================================================
*/
router.get(
    "/runtime",
    verifyJWT,
    checkPermission("skill:view"),
    controller.getRuntime
);

/*
==================================================
API0147
POST /execute
==================================================
*/
router.post(
    "/execute",
    verifyJWT,
    checkPermission("skill:execute"),
    controller.execute
);

// ==========================================================
// REPORT
// ==========================================================

/*
==================================================
API0148
GET /report
==================================================
*/
router.get(
    "/report",
    verifyJWT,
    checkPermission("skill:view"),
    controller.getReport
);

/*
==================================================
API0149
POST /export
==================================================
*/
router.post(
    "/export",
    verifyJWT,
    checkPermission("skill:export"),
    controller.exportData
);

// ==========================================================
// EXPORTS
// ==========================================================

module.exports = router;