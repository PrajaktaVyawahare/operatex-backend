const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const companyRoutes = require("./modules/company-master/company.routes");
const authRoutes = require("./modules/auth/auth.routes");
const plantShopRoutes =
require("./modules/plant-shop-master/plantshop.routes");
const lineRoutes =
require("./modules/line-master/line.routes");
const app = express();
const userRolePermissionRoutes =
    require("./modules/user-role-permission/userRolePermission.routes");

const machineRoutes = require("./modules/machine-master/machine.routes");
const shiftRoutes = require("./modules/shift-calendar/shift.routes");
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
console.log(process.env.JWT_SECRET);

module.exports = app;