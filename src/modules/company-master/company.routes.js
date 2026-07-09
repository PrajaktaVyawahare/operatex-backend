const express = require("express");
const router = express.Router();

const controller = require("./company.controller");
const { verifyJWT } = require("../../middleware/auth.middleware");
const { checkPermission } = require("../../middleware/permission.middleware");

router.post(
    "/",
    verifyJWT,
    checkPermission("company:create"),
    controller.createCompany
);

router.get(
    "/config",
    verifyJWT,
    checkPermission("company:view"),
    controller.getConfig
);

router.get(
    "/master",
    verifyJWT,
    checkPermission("company:view"),
    controller.getMaster
);

router.put(
    "/master/:id",
    verifyJWT,
    checkPermission("company:update"),
    controller.updateMaster
);

router.get(
    "/runtime",
    verifyJWT,
    checkPermission("company:view"),
    controller.getRuntime
);

router.post(
    "/execute",
    verifyJWT,
    checkPermission("company:execute"),
    controller.execute
);

router.get(
    "/report",
    verifyJWT,
    checkPermission("company:view"),
    controller.getReport
);

router.post(
    "/export",
    verifyJWT,
    checkPermission("company:view"),
    controller.exportData
);

module.exports = router;