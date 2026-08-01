// src/modules/user-role-permission/userRolePermission.repository.js

const db = require("../../../db/connection");
const query = require("./userRolePermission.query");

// ==========================================================
// CONFIG
// ==========================================================

const getConfig = async () => {
    const result = await db.query(query.GET_CONFIG);
    return result.rows;
};

// ==========================================================
// USER MASTER
// ==========================================================

const getAllUsers = async () => {
    const result = await db.query(query.GET_ALL_USERS);
    return result.rows;
};

const getUserById = async (userId) => {
    const result = await db.query(query.GET_USER_BY_ID, [userId]);
    return result.rows[0];
};

const createUser = async (data) => {

    const values = [
        data.employee_code,
        data.username,
        data.role_id,
        data.mobile_number,
        data.email_id,
        data.password,
        data.access_level,
        data.fingerprint,
        data.pin,
        data.joining_date,
        data.department,
        data.status,
        data.shift_assignment,
        data.line_assigned,
        data.machines_assigned,
        data.picture,
        data.documents
    ];

    const result = await db.query(query.INSERT_USER, values);

    return result.rows[0];
};

const updateUser = async (id, data) => {

    const values = [
        id,
        data.employee_code,
        data.username,
        data.role_id,
        data.mobile_number,
        data.email_id,
        data.access_level,
        data.fingerprint,
        data.pin,
        data.joining_date,
        data.department,
        data.status,
        data.shift_assignment,
        data.line_assigned,
        data.machines_assigned,
        data.picture,
        data.documents
    ];

    const result = await db.query(query.UPDATE_USER, values);

    return result.rows[0];
};

// ==========================================================
// ROLE MASTER
// ==========================================================

const getRoles = async () => {
    const result = await db.query(query.GET_ALL_ROLES);
    return result.rows;
};

const createRole = async (data) => {

    const result = await db.query(
        query.INSERT_ROLE,
        [
            data.role_code,
            data.role_name,
            data.level,
            data.description,
            data.status
        ]
    );

    return result.rows[0];
};

const updateRole = async (id, data) => {

    const result = await db.query(
        query.UPDATE_ROLE,
        [
            id,
            data.role_code,
            data.role_name,
            data.level,
            data.description,
            data.status
        ]
    );

    return result.rows[0];
};

// ==========================================================
// PERMISSION MASTER
// ==========================================================

const getPermissions = async () => {
    const result = await db.query(query.GET_ALL_PERMISSIONS);
    return result.rows;
};

const createPermission = async (data) => {

    const result = await db.query(
        query.INSERT_PERMISSION,
        [
            data.permission_code,
            
            data.module_name,
            data.action,
            data.description
        ]
    );

    return result.rows[0];
};

const updatePermission = async (id, data) => {

    const result = await db.query(
        query.UPDATE_PERMISSION,
        [
            id,
            data.permission_code,
            data.module_name,
            data.action,
            data.description
        ]
    );

    return result.rows[0];
};

// ==========================================================
// ROLE PERMISSION MAP
// ==========================================================

const getRolePermissions = async () => {
    const result = await db.query(query.GET_ROLE_PERMISSIONS);
    return result.rows;
};

const assignPermission = async (data) => {

    const result = await db.query(
        query.ASSIGN_PERMISSION,
        [
            data.role_id,
            data.permission_id,
            data.granted
        ]
    );

    return result.rows[0];
};

// ==========================================================
// USER MACHINE MAPPING
// ==========================================================

const getUserMachineMapping = async () => {
    const result = await db.query(query.GET_USER_MACHINE_MAPPING);
    return result.rows;
};

const createUserMachineMapping = async (data) => {

    const result = await db.query(
        query.INSERT_USER_MACHINE,
        [
            data.user_id,
            data.machine_id,
            data.access_type,
            data.status
        ]
    );

    return result.rows[0];
};

const updateUserMachineMapping = async (id, data) => {

    const result = await db.query(
        query.UPDATE_USER_MACHINE,
        [
            id,
            data.access_type,
            data.status
        ]
    );

    return result.rows[0];
};

// ==========================================================
// LOGIN LOG
// ==========================================================

const getLoginLogs = async () => {
    const result = await db.query(query.GET_LOGIN_LOG);
    return result.rows;
};

// ==========================================================
// REPORT
// ==========================================================

const getReport = async () => {
    const result = await db.query(query.GET_REPORT);
    return result.rows;
};

module.exports = {

    // Config
    getConfig,

    // User
    getAllUsers,
    getUserById,
    createUser,
    updateUser,

    // Role
    getRoles,
    createRole,
    updateRole,

    // Permission
    getPermissions,
    createPermission,
    updatePermission,

    // Role Permission
    getRolePermissions,
    assignPermission,

    // User Machine Mapping
    getUserMachineMapping,
    createUserMachineMapping,
    updateUserMachineMapping,

    // Login Log
    getLoginLogs,

    // Report
    getReport

};