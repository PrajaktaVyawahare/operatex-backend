// src/modules/route-station-master/route.routes.js

const express = require("express");

const router = express.Router();

const routeController =
    require("./route.controller");

const stationController =
    require("./station.controller");   

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
API0100
GET /config
==================================================
*/
router.get(
    "/config",
    verifyJWT,
    checkPermission("route:view"),
    routeController.getConfig
);

/*
==================================================
API0100A
GET /config/:id
==================================================
*/
router.get(
    "/config/:id",
    verifyJWT,
    checkPermission("route:view"),
    routeController.getConfigById
);

/*
==================================================
API0101
POST /config
==================================================
*/
router.post(
    "/config",
    verifyJWT,
    checkPermission("route:create"),
    routeController.createConfig
);

/*
==================================================
API0101A
PUT /config/:id
==================================================
*/
router.put(
    "/config/:id",
    verifyJWT,
    checkPermission("route:update"),
   routeController.updateConfig
);

/*
==================================================
API0101B
DELETE /config/:id
==================================================
*/
router.delete(
    "/config/:id",
    verifyJWT,
    checkPermission("route:delete"),
    routeController.deleteConfig
);

// ==========================================================
// MASTER
// ==========================================================

// ==========================================================
// ROUTE MASTER
// ==========================================================

router.get(
    "/route-master",
    verifyJWT,
    checkPermission("route:view"),
    routeController.getMaster
);

router.get(
    "/route-master/:id",
    verifyJWT,
    checkPermission("route:view"),
    routeController.getMasterById
);

router.post(
    "/route-master",
    verifyJWT,
    checkPermission("route:create"),
    routeController.createMaster
);

router.put(
    "/route-master/:id",
    verifyJWT,
    checkPermission("route:update"),
    routeController.updateMaster
);

router.delete(
    "/route-master/:id",
    verifyJWT,
    checkPermission("route:delete"),
    routeController.deleteMaster
);



// ==========================================================
// STATION MASTER
// ==========================================================

router.get(
    "/station-master",
    verifyJWT,
    checkPermission("station:view"),
    stationController.getMaster
);

router.get(
    "/station-master/:id",
    verifyJWT,
    checkPermission("station:view"),
    stationController.getMasterById
);

router.post(
    "/station-master",
    verifyJWT,
    checkPermission("station:create"),
    stationController.createMaster
);

router.put(
    "/station-master/:id",
    verifyJWT,
    checkPermission("station:update"),
    stationController.updateMaster
);

router.delete(
    "/station-master/:id",
    verifyJWT,
    checkPermission("station:delete"),
    stationController.deleteMaster
);
// ==========================================================
// RUNTIME
// ==========================================================

/*
==================================================
API0105
GET /runtime
==================================================
*/
router.get(
    "/runtime",
    verifyJWT,
    checkPermission("route:view"),
    routeController.getRuntime
);

/*
==================================================
API0106
POST /execute
==================================================
*/
router.post(
    "/execute",
    verifyJWT,
    checkPermission("route:execute"),
    routeController.execute
);

// ==========================================================
// REPORT
// ==========================================================

/*
==================================================
API0107
GET /report
==================================================
*/
router.get(
    "/report",
    verifyJWT,
    checkPermission("route:view"),
   routeController.getReport
);

/*
==================================================
API0108
POST /export
==================================================
*/
router.post(
    "/export",
    verifyJWT,
    checkPermission("route:export"),
   routeController.exportData
);

// ==========================================================
// EXPORTS
// ==========================================================

module.exports = router;