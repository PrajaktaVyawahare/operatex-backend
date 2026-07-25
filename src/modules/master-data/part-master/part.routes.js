// src/modules/part-master/part.routes.js

const express = require("express");

const router = express.Router();

const controller = require("./part.controller");

const {
    verifyJWT
} = require("../../../middleware/auth.middleware");

const {
    checkPermission
} = require("../../../middleware/permission.middleware");

// ==========================================================
// CONFIG
// ==========================================================

router.get(
    "/config",
    verifyJWT,
    checkPermission("part:view"),
    controller.getConfig
);
router.get(
    "/config/revision",
    verifyJWT,
    checkPermission("part:view"),
    controller.getRevisions
);

router.get(
    "/config/attribute",
    verifyJWT,
    checkPermission("part:view"),
    controller.getAttributes
); 


router.get(
    "/config/:id",
    verifyJWT,
    checkPermission("part:view"),
    controller.getConfigById
);

router.post(
    "/config",
    verifyJWT,
    checkPermission("part:update"),
    controller.createConfig
);

router.put(
    "/config/:table/:id",
    verifyJWT,
    checkPermission("part:update"),
    controller.updateConfig
);

router.delete(
    "/config/:table/:id",
    verifyJWT,
    checkPermission("part:delete"),
    controller.deleteConfig
);
/*
========================================
GET /config/revision
========================================
*/
router.get(
    "/config/revision",
    verifyJWT,
    checkPermission("part:view"),
    controller.getRevisions
);

/*
========================================
GET /config/attribute
========================================
*/
router.get(
    "/config/attribute",
    verifyJWT,
    checkPermission("part:view"),
    controller.getAttributes
);
// ==========================================================
// MASTER
// ==========================================================

router.get(
    "/master",
    verifyJWT,
    checkPermission("part:view"),
    controller.getMaster
);

router.get(
    "/master/:id",
    verifyJWT,
    checkPermission("part:view"),
    controller.getMasterById
);

router.post(
    "/master",
    verifyJWT,
    checkPermission("part:create"),
    controller.createMaster
);

router.put(
    "/master/:id",
    verifyJWT,
    checkPermission("part:update"),
    controller.updateMaster
);

router.delete(
    "/master/:id",
    verifyJWT,
    checkPermission("part:delete"),
    controller.deleteMaster
);

// ==========================================================
// RUNTIME
// ==========================================================

router.get(
    "/runtime",
    verifyJWT,
    checkPermission("part:view"),
    controller.getRuntime
);

// ==========================================================
// EXECUTE
// ==========================================================

router.post(
    "/execute",
    verifyJWT,
    checkPermission("part:execute"),
    controller.execute
);

// ==========================================================
// REPORT
// ==========================================================

router.get(
    "/report",
    verifyJWT,
    checkPermission("part:view"),
    controller.getReport
);

// ==========================================================
// EXPORT
// ==========================================================

router.post(
    "/export",
    verifyJWT,
    checkPermission("part:export"),
    controller.exportData
);

module.exports = router;