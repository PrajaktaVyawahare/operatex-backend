const express = require("express");
const router = express.Router();

const controller = require("./machine.controller");

const {
    verifyJWT
} = require("../../../middleware/auth.middleware");

const {
    checkPermission
} = require("../../../middleware/permission.middleware");

/*
========================================
API0035
GET /config
========================================
*/
router.get(
    "/config",
    verifyJWT,
    checkPermission("machine:view"),
    controller.getConfig
);

/*
========================================
API0035A
GET /config/capability
========================================
*/
router.get(
    "/config/capability",
    verifyJWT,
    checkPermission("machine:view"),
    controller.getCapabilityConfig
);

/*
========================================
API0035B
GET /config/group
========================================
*/
router.get(
    "/config/group",
    verifyJWT,
    checkPermission("machine:view"),
    controller.getGroupConfig
);

/*
========================================
API0036
POST /config
========================================
*/
router.post(
    "/config",
    verifyJWT,
    checkPermission("machine:create"),
    controller.createConfig
);
/*
========================================
PUT /config/:type/:id
========================================
*/
router.put(
    "/config/:type/:id",
    verifyJWT,
    checkPermission("machine:update"),
    controller.updateConfig
);
/*
========================================
DELETE /config/:type/:id
========================================
*/
router.delete(
    "/config/:type/:id",
    verifyJWT,
    checkPermission("machine:delete"),
    controller.deleteConfig
);
/*
========================================
API0037
GET /master
========================================
*/
router.get(
    "/master",
    verifyJWT,
    checkPermission("machine:view"),
    controller.getMaster
);

/*
========================================
API0038
POST /master
========================================
*/
router.post(
    "/master",
    verifyJWT,
    checkPermission("machine:create"),
    controller.createMaster
);

/*
========================================
API0039
PUT /master/:id
========================================
*/
router.put(
    "/master/:id",
    verifyJWT,
    checkPermission("machine:update"),
    controller.updateMaster
);

/*
========================================
API0040
GET /runtime
========================================
*/
router.get(
    "/runtime",
    verifyJWT,
    checkPermission("machine:view"),
    controller.getRuntime
);

/*
========================================
API0041
POST /execute
========================================
*/
router.post(
    "/execute",
    verifyJWT,
    checkPermission("machine:execute"),
    controller.execute
);

/*
========================================
DELETE /master/:id
========================================
*/
router.delete(
    "/master/:id",
    verifyJWT,
    checkPermission("machine:delete"),
    controller.deleteMaster
);

/*
========================================
API0042
GET /report
========================================
*/
router.get(
    "/report",
    verifyJWT,
    checkPermission("machine:view"),
    controller.getReport
);

/*
========================================
API0043
POST /export
========================================
*/
router.post(
    "/export",
    verifyJWT,
    checkPermission("machine:export"),
    controller.exportData
);

module.exports = router;