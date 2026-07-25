// src/modules/document-sop-master/document.routes.js

const express = require("express");

const router = express.Router();

const controller =
    require("./document.controller");

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
API0127
GET /config
==================================================
*/
router.get(
    "/config",
    verifyJWT,
    checkPermission("document:view"),
    controller.getConfig
);

/*
==================================================
API0127A
GET /config/:id
==================================================
*/
router.get(
    "/config/:id",
    verifyJWT,
    checkPermission("document:view"),
    controller.getConfigById
);

/*
==================================================
API0128
POST /config
==================================================
*/
router.post(
    "/config",
    verifyJWT,
    checkPermission("document:create"),
    controller.createConfig
);

/*
==================================================
API0128A
PUT /config/:id
==================================================
*/
router.put(
    "/config/:id",
    verifyJWT,
    checkPermission("document:update"),
    controller.updateConfig
);

/*
==================================================
API0128B
DELETE /config/:id
==================================================
*/
router.delete(
    "/config/:id",
    verifyJWT,
    checkPermission("document:delete"),
    controller.deleteConfig
);

// ==========================================================
// MASTER
// ==========================================================

/*
==================================================
API0129
GET /master
==================================================
*/
router.get(
    "/master",
    verifyJWT,
    checkPermission("document:view"),
    controller.getMaster
);

/*
==================================================
API0129A
GET /master/:id
==================================================
*/
router.get(
    "/master/:id",
    verifyJWT,
    checkPermission("document:view"),
    controller.getMasterById
);

/*
==================================================
API0130
POST /master
==================================================
*/
router.post(
    "/master",
    verifyJWT,
    checkPermission("document:create"),
    controller.createMaster
);

/*
==================================================
API0131
PUT /master/:id
==================================================
*/
router.put(
    "/master/:id",
    verifyJWT,
    checkPermission("document:update"),
    controller.updateMaster
);

/*
==================================================
API0131A
DELETE /master/:id
==================================================
*/
router.delete(
    "/master/:id",
    verifyJWT,
    checkPermission("document:delete"),
    controller.deleteMaster
);

// ==========================================================
// RUNTIME
// ==========================================================

/*
==================================================
API0132
GET /runtime
==================================================
*/
router.get(
    "/runtime",
    verifyJWT,
    checkPermission("document:view"),
    controller.getRuntime
);

/*
==================================================
API0133
POST /execute
==================================================
*/
router.post(
    "/execute",
    verifyJWT,
    checkPermission("document:execute"),
    controller.execute
);

// ==========================================================
// REPORT
// ==========================================================

/*
==================================================
API0134
GET /report
==================================================
*/
router.get(
    "/report",
    verifyJWT,
    checkPermission("document:view"),
    controller.getReport
);

/*
==================================================
API0135
POST /export
==================================================
*/
router.post(
    "/export",
    verifyJWT,
    checkPermission("document:export"),
    controller.exportData
);

// ==========================================================
// EXPORTS
// ==========================================================

module.exports = router;