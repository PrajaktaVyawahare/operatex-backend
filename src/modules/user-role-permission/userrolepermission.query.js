// src/modules/user-role-permission/userRolePermission.query.js

module.exports = {

    // ===========================================================
    // CONFIG
    // ===========================================================

    GET_CONFIG: `
        SELECT
            r.role_id,
            r.role_name,
            r.role_code,
            r.level,
            r.status,
            COUNT(rpm.permission_id) AS total_permissions
        FROM role_master r
        LEFT JOIN role_permission_map rpm
            ON r.role_id = rpm.role_id
        GROUP BY
            r.role_id,
            r.role_name,
            r.role_code,
            r.level,
            r.status
        ORDER BY r.role_name;
    `,

    // ===========================================================
    // USER MASTER
    // ===========================================================

    GET_ALL_USERS: `
        SELECT
            u.user_id,
            u.employee_code,
            u.username,
            u.mobile_number,
            u.email_id,
            u.department,
            u.access_level,
            u.status,
            u.joining_date,
            r.role_id,
            r.role_name,
            r.role_code,
            l.line_name
        FROM user_master u
        INNER JOIN role_master r
            ON u.role_id = r.role_id
        LEFT JOIN line_master l
            ON u.line_assigned = l.line_id
        ORDER BY u.user_id DESC;
    `,

    GET_USER_BY_ID: `
        SELECT
            u.*,
            r.role_name,
            r.role_code,
            l.line_name
        FROM user_master u
        INNER JOIN role_master r
            ON u.role_id = r.role_id
        LEFT JOIN line_master l
            ON u.line_assigned = l.line_id
        WHERE u.user_id=$1;
    `,

    INSERT_USER: `
        INSERT INTO user_master
        (
            employee_code,
            username,
            role_id,
            mobile_number,
            email_id,
            password,
            access_level,
            fingerprint,
            pin,
            joining_date,
            department,
            status,
            shift_assignment,
            line_assigned,
            machines_assigned,
            picture,
            documents
        )
        VALUES
        (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
            $11,$12,$13,$14,$15,$16,$17
        )
        RETURNING *;
    `,

    UPDATE_USER: `
        UPDATE user_master
        SET
            employee_code=$2,
            username=$3,
            role_id=$4,
            mobile_number=$5,
            email_id=$6,
            access_level=$7,
            fingerprint=$8,
            pin=$9,
            joining_date=$10,
            department=$11,
            status=$12,
            shift_assignment=$13,
            line_assigned=$14,
            machines_assigned=$15,
            picture=$16,
            documents=$17,
            updated_at=NOW()
        WHERE user_id=$1
        RETURNING *;
    `,

    // ===========================================================
    // ROLE MASTER
    // ===========================================================

    GET_ALL_ROLES: `
        SELECT *
        FROM role_master
        ORDER BY role_name;
    `,

    INSERT_ROLE: `
        INSERT INTO role_master
        (
            role_code,
            role_name,
            level,
            description,
            status
        )
        VALUES
        (
            $1,$2,$3,$4,$5
        )
        RETURNING *;
    `,

    UPDATE_ROLE: `
        UPDATE role_master
        SET
            role_code=$2,
            role_name=$3,
            level=$4,
            description=$5,
            status=$6,
            updated_at=NOW()
        WHERE role_id=$1
        RETURNING *;
    `,

    // ===========================================================
    // PERMISSION MASTER
    // ===========================================================

    GET_ALL_PERMISSIONS: `
        SELECT *
        FROM permission_master
        ORDER BY module_name, action;
    `,

    INSERT_PERMISSION: `
        INSERT INTO permission_master
        (
            permission_code,
            module_name,
            action,
            description
        )
        VALUES
        (
            $1,$2,$3,$4
        )
        RETURNING *;
    `,

    UPDATE_PERMISSION: `
        UPDATE permission_master
        SET
            permission_code=$2,
            module_name=$3,
            action=$4,
            description=$5
        WHERE permission_id=$1
        RETURNING *;
    `,

    // ===========================================================
    // ROLE PERMISSION MAP
    // ===========================================================

    GET_ROLE_PERMISSIONS: `
        SELECT
            rpm.map_id,
            r.role_name,
            r.role_code,
            p.permission_id,
            p.permission_code,
            p.module_name,
            p.action,
            rpm.granted
        FROM role_permission_map rpm
        INNER JOIN role_master r
            ON rpm.role_id=r.role_id
        INNER JOIN permission_master p
            ON rpm.permission_id=p.permission_id
        ORDER BY
            r.role_name,
            p.module_name,
            p.action;
    `,

    ASSIGN_PERMISSION: `
        INSERT INTO role_permission_map
        (
            role_id,
            permission_id,
            granted
        )
        VALUES
        (
            $1,$2,$3
        )
        ON CONFLICT(role_id,permission_id)
        DO UPDATE
        SET granted=EXCLUDED.granted
        RETURNING *;
    `,

    // ===========================================================
    // USER MACHINE MAPPING
    // ===========================================================

    GET_USER_MACHINE_MAPPING: `
        SELECT
            um.mapping_id,
            u.user_id,
            u.username,
            m.machine_id,
            m.machine_name,
            um.access_type,
            um.status
        FROM user_machine_mapping um
        INNER JOIN user_master u
            ON um.user_id=u.user_id
        INNER JOIN machine_master m
            ON um.machine_id=m.machine_id
        ORDER BY u.username;
    `,

    INSERT_USER_MACHINE: `
        INSERT INTO user_machine_mapping
        (
            user_id,
            machine_id,
            access_type,
            status
        )
        VALUES
        (
            $1,$2,$3,$4
        )
        RETURNING *;
    `,

    UPDATE_USER_MACHINE: `
        UPDATE user_machine_mapping
        SET
            access_type=$2,
            status=$3,
            updated_at=NOW()
        WHERE mapping_id=$1
        RETURNING *;
    `,

    // ===========================================================
    // LOGIN LOG
    // ===========================================================

    GET_LOGIN_LOG: `
        SELECT
            ll.login_log_id,
            u.username,
            u.employee_code,
            r.role_name,
            ll.login_time,
            ll.logout_time,
            ll.login_status,
            ll.login_ip,
            ll.device_name
        FROM login_log ll
        INNER JOIN user_master u
            ON ll.user_id=u.user_id
        INNER JOIN role_master r
            ON u.role_id=r.role_id
        ORDER BY ll.login_time DESC;
    `,

    // ===========================================================
    // REPORT
    // ===========================================================

    GET_REPORT: `
        SELECT
            u.user_id,
            u.username,
            u.employee_code,
            r.role_name,
            COUNT(DISTINCT rpm.permission_id) AS total_permissions,
            COUNT(DISTINCT um.mapping_id) AS total_machines
        FROM user_master u
        INNER JOIN role_master r
            ON u.role_id=r.role_id
        LEFT JOIN role_permission_map rpm
            ON r.role_id=rpm.role_id
        LEFT JOIN user_machine_mapping um
            ON u.user_id=um.user_id
        GROUP BY
            u.user_id,
            u.username,
            u.employee_code,
            r.role_name
        ORDER BY u.username;
    `

};