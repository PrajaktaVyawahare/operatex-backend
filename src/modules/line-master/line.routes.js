const express = require("express");
const router = express.Router();

const controller = require("./line.controller");

const {
    verifyJWT
} = require("../../middleware/auth.middleware");

const {
    checkPermission
} = require("../../middleware/permission.middleware");

/*
========================================
API0019
GET /config
========================================
*/
router.get(
    "/config",
    verifyJWT,
    checkPermission("line:view"),
    controller.getConfig
);

/*
========================================
API0020
POST /config
========================================
*/
router.post(
    "/config",
    verifyJWT,
    checkPermission("line:update"),
    controller.updateConfig
);

/*
========================================
API0021
GET /master
========================================
*/
router.get(
    "/master",
    verifyJWT,
    checkPermission("line:view"),
    controller.getMaster
);

/*
========================================
API0022
POST /master
========================================
*/
router.post(
    "/master",
    verifyJWT,
    checkPermission("line:create"),
    controller.createMaster
);

/*
========================================
API0023
PUT /master/:id
========================================
*/
router.put(
    "/master/:id",
    verifyJWT,
    checkPermission("line:update"),
    controller.updateMaster
);

/*
========================================
API0024
GET /runtime
========================================
*/
router.get(
    "/runtime",
    verifyJWT,
    checkPermission("line:view"),
    controller.getRuntime
);

/*
========================================
API0025
POST /execute
========================================
*/
router.post(
    "/execute",
    verifyJWT,
    checkPermission("line:execute"),
    controller.execute
);

/*
========================================
API0026
GET /report
========================================
*/
router.get(
    "/report",
    verifyJWT,
    checkPermission("line:view"),
    controller.getReport
);

/*
========================================
API0027
POST /export
========================================
*/
router.post(
    "/export",
    verifyJWT,
    checkPermission("line:export"),
    controller.exportData
);

module.exports = router;