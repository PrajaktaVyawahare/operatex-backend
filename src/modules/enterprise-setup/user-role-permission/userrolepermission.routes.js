const express = require("express");
const router = express.Router();

const controller = require("./userRolePermission.controller");

const {
    verifyJWT
} = require("../../../middleware/auth.middleware");

const {
    checkPermission
} = require("../../../middleware/permission.middleware");

/*
========================================
API00XX
GET /config
========================================
*/
router.get(
    "/config",
    verifyJWT,
    checkPermission("user:view"),
    controller.getConfig
);

/*
========================================
API00XX
POST /config
========================================

/*
========================================
API00XX
GET /master
========================================
*/
router.get(
    "/master",
    verifyJWT,
    checkPermission("user:view"),
    controller.getMaster
);

/*
========================================
API00XX
POST /master
========================================
*/
router.post(
    "/master",
    verifyJWT,
    checkPermission("user:create"),
    controller.createMaster
);

/*
========================================
API00XX
PUT /master/:id
========================================
*/
router.put(
    "/master/:id",
    verifyJWT,
    checkPermission("user:update"),
    controller.updateMaster
);

/*
========================================
API00XX
GET /runtime
========================================
*/
router.get(
    "/runtime",
    verifyJWT,
    checkPermission("user:view"),
    controller.getRuntime
);

/*
========================================
API00XX
POST /execute
========================================
*/
router.post(
    "/execute",
    verifyJWT,
    checkPermission("user:execute"),
    controller.execute
);

/*
========================================
API00XX
GET /report
========================================
*/
router.get(
    "/report",
    verifyJWT,
    checkPermission("user:view"),
    controller.getReport
);

/*
========================================
API00XX
POST /export
========================================
*/
router.post(
    "/export",
    verifyJWT,
    checkPermission("user:export"),
    controller.exportData
);

module.exports = router;