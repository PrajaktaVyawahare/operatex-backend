const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const companyRoutes = require("./modules/enterprise-setup/company-master/company.routes");
const authRoutes = require("./modules/auth/auth.routes");
const plantShopRoutes =
require("./modules/enterprise-setup/plant-shop-master/plantshop.routes");
const lineRoutes =
require("./modules/enterprise-setup/line-master/line.routes");
const app = express();
const userRolePermissionRoutes =
    require("./modules/enterprise-setup/user-role-permission/userRolePermission.routes");

const machineRoutes = require("./modules/master-data/machine-master/machine.routes");
const shiftRoutes = require("./modules/enterprise-setup/shift-calendar/shift.routes");
const partMasterRoutes = require(
   "./modules/master-data/part-master/part.routes"

);


const processRoutes =
    require("./modules/master-data/process-master/process.routes");

const routeStationRoutes =
    require("./modules/master-data/route-station-master/route.routes");    
const toolRoutes =
    require("./modules/master-data/tool-master/tool.routes");

const gaugeRoutes =
    require("./modules/master-data/gauge-instrument-master/gauge.routes");
const documentRoutes =
    require("./modules/master-data/document-sop-master/document.routes");
    const skillRoutes =
    require("./modules/master-data/skill-matrix/skill.routes");
const signalRoutes =
    require("./modules/master-data/signal-mapping/signal.routes");    

const deviceRoutes =
    require("./modules/master-data/device-master/device.routes");  
app.use(cors());
app.use(helmet());
app.use(express.json());




app.use("/api/company-master", companyRoutes);
app.use("/api/auth", authRoutes);
app.use(
   "/api/plant-shop-master",
   plantShopRoutes
);
app.use("/api/line-master", lineRoutes);
app.use(
    "/api/user-role-permission",
    userRolePermissionRoutes
);
app.use(
    "/api/machine-master",
    machineRoutes
);
app.use(
    "/api/shift-calendar",
    shiftRoutes
);
app.use(
    "/api/part-master",
    partMasterRoutes
);
app.use(
    "/api/process-master",
    processRoutes
);
app.use(
    "/api/route-station-master",
    routeStationRoutes
);
app.use(
    "/api/tool-master",
    toolRoutes
);
app.use(
    "/api/gauge-instrument-master",
    gaugeRoutes
);
app.use(
    "/api/document-sop-master",
    documentRoutes
);
app.use(
    "/api/skill-matrix",
    skillRoutes
);
app.use(
    "/api/signal-mapping",
    signalRoutes
);
app.use(
    "/api/device-master",
    deviceRoutes
);


console.log(process.env.JWT_SECRET);

module.exports = app;