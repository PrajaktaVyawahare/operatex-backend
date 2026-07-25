const express = require("express");
const router = express.Router();

const controller =
    require("./plantshop.controller");

const {
    verifyJWT
} = require("../../../middleware/auth.middleware");

const {
    checkPermission
} = require("../../../middleware/permission.middleware");

router.get(
    "/config",
    verifyJWT,
    checkPermission("plantshop:view"),
    controller.getConfig
);

router.post(
    "/config",
    verifyJWT,
    checkPermission("plantshop:update"),
    controller.getConfig
);

router.get(
    "/master",
    verifyJWT,
    checkPermission("plantshop:view"),
    controller.getMaster
);

router.post(
    "/master",
    verifyJWT,
    checkPermission("plantshop:create"),
    controller.createMaster
);

router.put(
    "/master/:id",
    verifyJWT,
    checkPermission("plantshop:update"),
    controller.updateMaster
);

router.get(
    "/runtime",
    verifyJWT,
    checkPermission("plantshop:view"),
    controller.getRuntime
);

router.post(
    "/execute",
    verifyJWT,
    checkPermission("plantshop:execute"),
    controller.execute
);

router.get(
    "/report",
    verifyJWT,
    checkPermission("plantshop:view"),
    controller.getReport
);

router.post(
    "/export",
    verifyJWT,
    checkPermission("plantshop:view"),
    controller.exportData
);

module.exports = router;