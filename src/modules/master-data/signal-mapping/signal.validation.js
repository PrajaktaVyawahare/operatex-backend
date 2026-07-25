const { body, param } = require("express-validator");

// ======================================================
// CONFIG VALIDATION
// ======================================================

// ==========================================================
// UPDATE PROTOCOL CONFIG
// ==========================================================

const updateProtocolConfig = [

    body("protocol_id")
        .isInt()
        .withMessage("Protocol ID is required"),

    body("protocol_name")
        .notEmpty()
        .withMessage("Protocol name is required"),

    body("timeout")
        .isInt({ min: 0 })
        .withMessage("Timeout must be a positive integer"),

    body("retry")
        .isInt({ min: 0 })
        .withMessage("Retry must be a positive integer"),

    body("polling_ms")
        .isInt({ min: 0 })
        .withMessage("Polling interval must be a positive integer"),

    body("read_function_code")
        .isInt()
        .withMessage("Read function code must be numeric"),

    body("write_function_code")
        .isInt()
        .withMessage("Write function code must be numeric"),

    body("packet_size")
        .isInt({ min: 1 })
        .withMessage("Packet size must be greater than zero"),

    body("connection_type")
        .notEmpty()
        .withMessage("Connection type is required"),

    body("description")
        .optional(),

    body("status")
        .isIn(["ACTIVE", "INACTIVE"])
        .withMessage("Status must be ACTIVE or INACTIVE")

];

// ==========================================================
// UPDATE GATEWAY CONFIG
// ==========================================================

const updateGatewayConfig = [

    body("gateway_id")
        .isInt()
        .withMessage("Gateway ID is required"),

    body("gateway_name")
        .notEmpty()
        .withMessage("Gateway name is required"),

    body("gateway_code")
        .notEmpty()
        .withMessage("Gateway code is required"),

    body("gateway_type")
        .notEmpty()
        .withMessage("Gateway type is required"),

    body("broker_url")
        .notEmpty()
        .withMessage("Broker URL is required"),

    body("broker_port")
        .isInt({ min: 1 })
        .withMessage("Broker port must be numeric"),

    body("username")
        .notEmpty()
        .withMessage("Username is required"),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),

    body("site")
        .notEmpty()
        .withMessage("Site is required"),

    body("location")
        .notEmpty()
        .withMessage("Location is required"),

    body("heartbeat_interval")
        .isInt({ min: 0 })
        .withMessage("Heartbeat interval must be numeric"),

    body("reconnect_interval")
        .isInt({ min: 0 })
        .withMessage("Reconnect interval must be numeric"),

    body("gateway_version")
        .notEmpty()
        .withMessage("Gateway version is required"),

    body("status")
        .isIn(["ACTIVE", "INACTIVE"])
        .withMessage("Status must be ACTIVE or INACTIVE")

];

// ======================================================
// CREATE MASTER VALIDATION
// ======================================================

const createMasterValidation = [

    body("machine_id")
        .notEmpty()
        .withMessage("Machine ID is required")
        .isInt()
        .withMessage("Machine ID must be an integer"),

    body("signal_name")
        .notEmpty()
        .withMessage("Signal Name is required"),

    body("tag_name")
        .notEmpty()
        .withMessage("Tag Name is required"),

    body("protocol")
        .notEmpty()
        .withMessage("Protocol is required"),

    body("address")
        .notEmpty()
        .withMessage("Address is required"),

    body("data_type")
        .notEmpty()
        .withMessage("Data Type is required"),

    body("access_type")
        .notEmpty()
        .withMessage("Access Type is required"),

    body("scaling_factor")
        .optional()
        .isNumeric()
        .withMessage("Scaling Factor must be numeric"),

    body("unit")
        .optional(),

    body("status")
        .notEmpty()
        .withMessage("Status is required")
        .isIn(["ACTIVE", "INACTIVE"])
        .withMessage("Invalid Status")

];

// ======================================================
// UPDATE MASTER VALIDATION
// ======================================================

const updateMasterValidation = [

    param("id")
        .isInt()
        .withMessage("Invalid Mapping ID"),

    body("machine_id")
        .notEmpty()
        .isInt()
        .withMessage("Machine ID is required"),

    body("signal_name")
        .notEmpty()
        .withMessage("Signal Name is required"),

    body("tag_name")
        .notEmpty()
        .withMessage("Tag Name is required"),

    body("protocol")
        .notEmpty()
        .withMessage("Protocol is required"),

    body("address")
        .notEmpty()
        .withMessage("Address is required"),

    body("data_type")
        .notEmpty()
        .withMessage("Data Type is required"),

    body("access_type")
        .notEmpty()
        .withMessage("Access Type is required"),

    body("scaling_factor")
        .optional()
        .isNumeric()
        .withMessage("Scaling Factor must be numeric"),

    body("unit")
        .optional(),

    body("status")
        .notEmpty()
        .isIn(["ACTIVE", "INACTIVE"])
        .withMessage("Invalid Status")

];
// ======================================================
// PATCH MASTER VALIDATION
// ======================================================

const patchMasterValidation = [

    param("id")
        .isInt()
        .withMessage("Invalid Mapping ID"),

    body("machine_id")
        .optional()
        .isInt()
        .withMessage("Machine ID must be an integer"),

    body("signal_name")
        .optional()
        .notEmpty()
        .withMessage("Signal Name cannot be empty"),

    body("tag_name")
        .optional()
        .notEmpty()
        .withMessage("Tag Name cannot be empty"),

    body("protocol")
        .optional()
        .notEmpty()
        .withMessage("Protocol cannot be empty"),

    body("address")
        .optional()
        .notEmpty()
        .withMessage("Address cannot be empty"),

    body("data_type")
        .optional()
        .notEmpty()
        .withMessage("Data Type cannot be empty"),

    body("access_type")
        .optional()
        .notEmpty()
        .withMessage("Access Type cannot be empty"),

    body("scaling_factor")
        .optional()
        .isNumeric()
        .withMessage("Scaling Factor must be numeric"),

    body("unit")
        .optional(),

    body("status")
        .optional()
        .isIn(["ACTIVE", "INACTIVE"])
        .withMessage("Invalid Status")

];
// ======================================================
// EXECUTE VALIDATION
// ======================================================

const executeValidation = [

    body("mapping_id")
        .notEmpty()
        .withMessage("Mapping ID is required")
        .isInt()
        .withMessage("Mapping ID must be an integer"),

    body("raw_value")
        .notEmpty()
        .withMessage("Raw Value is required"),

    body("gateway_name")
        .notEmpty()
        .withMessage("Gateway Name is required"),

    body("protocol")
        .notEmpty()
        .withMessage("Protocol is required"),

    body("quality")
        .notEmpty()
        .withMessage("Quality is required")

];

// ======================================================
// GET MASTER BY ID VALIDATION
// ======================================================

const getMasterByIdValidation = [

    param("id")
        .isInt()
        .withMessage("Invalid Mapping ID")

];

// ======================================================
// DELETE MASTER VALIDATION
// ======================================================

const deleteMasterValidation = [

    param("id")
        .isInt()
        .withMessage("Invalid Mapping ID")

];
// ======================================================
// DELETE MULTIPLE VALIDATION
// ======================================================

const deleteMultipleMasterValidation = [

    body("ids")
        .isArray({ min: 1 })
        .withMessage("IDs array is required")

];
module.exports = {

    updateProtocolConfig,

    updateGatewayConfig,

    createMasterValidation,

    updateMasterValidation,

    patchMasterValidation,

    getMasterByIdValidation,

    deleteMasterValidation,

    deleteMultipleMasterValidation,

    executeValidation

};