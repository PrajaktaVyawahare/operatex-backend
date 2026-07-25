// src/modules/process-master/process.routes.js

const express = require("express");

const router = express.Router();

const controller = require("./process.controller");

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
GET /config/revision
========================================
*/
router.get(
    "/config/revision",
    verifyJWT,
    checkPermission("process:view"),
    controller.getRevisions
);

/*
========================================
GET /config/operation
========================================
*/
router.get(
    "/config/operation",
    verifyJWT,
    checkPermission("process:view"),
    controller.getOperations
);
/*
========================================
API0055
GET /config
========================================
*/
router.get(
    "/config",
    verifyJWT,
    checkPermission("process:view"),
    controller.getConfig
);

/*
========================================
API0055A
GET /config/:id
========================================
*/
router.get(
    "/config/:id",
    verifyJWT,
    checkPermission("process:view"),
    controller.getConfigById
);

/*
========================================
API0056
POST /config
========================================
*/
router.post(
    "/config",
    verifyJWT,
    checkPermission("process:create"),
    controller.createConfig
);

/*
========================================
API0056A
PUT /config/:id
========================================
*/
router.put(
    "/config/:id",
    verifyJWT,
    checkPermission("process:update"),
    controller.updateConfig
);

/*
========================================
API0056B
DELETE /config/:id
========================================
*/
router.delete(
    "/config/:id",
    verifyJWT,
    checkPermission("process:delete"),
    controller.deleteConfig
);

// ==========================================================
// MASTER
// ==========================================================

/*
========================================
API0057
GET /master
========================================
*/
router.get(
    "/master",
    verifyJWT,
    checkPermission("process:view"),
    controller.getMaster
);

/*
========================================
API0057A
GET /master/:id
========================================
*/
router.get(
    "/master/:id",
    verifyJWT,
    checkPermission("process:view"),
    controller.getMasterById
);

/*
========================================
API0058
POST /master
========================================
*/
router.post(
    "/master",
    verifyJWT,
    checkPermission("process:create"),
    controller.createMaster
);

/*
========================================
API0059
PUT /master/:id
========================================
*/
router.put(
    "/master/:id",
    verifyJWT,
    checkPermission("process:update"),
    controller.updateMaster
);

/*
========================================
API0059A
DELETE /master/:id
========================================
*/
router.delete(
    "/master/:id",
    verifyJWT,
    checkPermission("process:delete"),
    controller.deleteMaster
);

// ==========================================================
// RUNTIME
// ==========================================================

/*
========================================
API0060
GET /runtime
========================================
*/
router.get(
    "/runtime",
    verifyJWT,
    checkPermission("process:view"),
    controller.getRuntime
);

/*
========================================
API0061
POST /execute
========================================
*/
router.post(
    "/execute",
    verifyJWT,
    checkPermission("process:execute"),
    controller.execute
);

// ==========================================================
// REPORT
// ==========================================================

/*
========================================
API0062
GET /report
========================================
*/
router.get(
    "/report",
    verifyJWT,
    checkPermission("process:view"),
    controller.getReport
);

/*
========================================
API0063
POST /export
========================================
*/
router.post(
    "/export",
    verifyJWT,
    checkPermission("process:export"),
    controller.exportData
);

module.exports = router;