const { body, param } = require("express-validator");

// ======================================================
// CONFIG VALIDATION
// ======================================================

const configValidation = [

    body("type")
        .notEmpty()
        .withMessage("Type is required")
        .isIn(["protocol", "gateway"])
        .withMessage("Type must be protocol or gateway")

];

// ======================================================
// CREATE DEVICE VALIDATION
// ======================================================

const createMasterValidation = [

    body("machine_id")
        .notEmpty()
        .withMessage("Machine ID is required")
        .isInt()
        .withMessage("Machine ID must be an integer"),

    body("device_type")
        .notEmpty()
        .withMessage("Device Type is required"),

    body("protocol")
        .notEmpty()
        .withMessage("Protocol is required"),

    body("ip")
        .notEmpty()
        .withMessage("IP Address is required")
        .isIP()
        .withMessage("Invalid IP Address"),

    body("port")
        .notEmpty()
        .withMessage("Port is required")
        .isInt({ min: 1, max: 65535 })
        .withMessage("Invalid Port Number"),

    body("slave_id")
        .optional()
        .isInt({ min: 1, max: 247 })
        .withMessage("Invalid Slave ID"),

    body("status")
        .notEmpty()
        .withMessage("Status is required")
        .isIn(["ACTIVE", "INACTIVE", "FAULTY"])
        .withMessage("Invalid Status")

];

// ======================================================
// UPDATE DEVICE VALIDATION
// ======================================================

const updateMasterValidation = [

    param("id")
        .isInt()
        .withMessage("Invalid Device ID"),

    body("machine_id")
        .notEmpty()
        .isInt()
        .withMessage("Machine ID is required"),

    body("device_type")
        .notEmpty()
        .withMessage("Device Type is required"),

    body("protocol")
        .notEmpty()
        .withMessage("Protocol is required"),

    body("ip")
        .notEmpty()
        .isIP()
        .withMessage("Invalid IP Address"),

    body("port")
        .notEmpty()
        .isInt({ min: 1, max: 65535 })
        .withMessage("Invalid Port Number"),

    body("slave_id")
        .optional()
        .isInt({ min: 1, max: 247 })
        .withMessage("Invalid Slave ID"),

    body("status")
        .notEmpty()
        .isIn(["ACTIVE", "INACTIVE", "FAULTY"])
        .withMessage("Invalid Status")

];

// ======================================================
// EXECUTE VALIDATION
// ======================================================

const executeValidation = [

    body("device_id")
        .notEmpty()
        .withMessage("Device ID is required")
        .isInt()
        .withMessage("Device ID must be an integer")

];
// ======================================================
// GET MASTER BY ID
// ======================================================

const getMasterByIdValidation = [

    param("id")
        .isInt()
        .withMessage("Valid device id is required"),

    

];
// ======================================================
// PATCH MASTER
// ======================================================

const patchMasterValidation = [

    param("id")
        .isInt()
        .withMessage("Valid device id is required"),

    body("machine_id")
        .optional()
        .isInt()
        .withMessage("Machine ID must be an integer"),

    body("device_type")
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage("Device type is invalid"),

    body("protocol")
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage("Protocol is invalid"),

    body("ip")
        .optional()
        .isIP()
        .withMessage("Valid IP address is required"),

    body("port")
        .optional()
        .isInt({ min: 1, max: 65535 })
        .withMessage("Port must be between 1 and 65535"),

    body("slave_id")
        .optional({ nullable: true })
        .isInt({ min: 1, max: 247 })
        .withMessage("Slave ID must be between 1 and 247"),

    body("status")
        .optional()
        .isIn(["ACTIVE", "INACTIVE", "FAULTY"])
        .withMessage("Invalid status"),

    

];
// ======================================================
// DELETE MASTER
// ======================================================

const deleteMasterValidation = [

    param("id")
        .isInt()
        .withMessage("Valid device id is required"),

    

];
// ======================================================
// DELETE MULTIPLE MASTER
// ======================================================

const deleteMultipleMasterValidation = [

    body("ids")
        .isArray({ min: 1 })
        .withMessage("IDs array is required"),

    body("ids.*")
        .isInt()
        .withMessage("Each ID must be an integer"),

    

];

module.exports = {

    configValidation,

    createMasterValidation,

    updateMasterValidation,

    getMasterByIdValidation,

    patchMasterValidation,

    deleteMasterValidation,

    deleteMultipleMasterValidation,

    executeValidation

};