const db = require("../../db/connection");

async function getUserByUsername(username) {
    const result = await db.query(
        `
        SELECT u.*, r.role_name
        FROM user_master u
        JOIN role_master r
        ON u.role_id = r.role_id
        WHERE u.username = $1
        `,
        [username]
    );

    return result.rows[0];
}

async function createLoginLog(data) {
    await db.query(
        `
        INSERT INTO login_log
        (
            user_id,
            login_time,
            login_status,
            login_ip,
            device_name,
            session_id
        )
        VALUES
        (
            $1,
            NOW(),
            $2,
            $3,
            $4,
            $5
        )
        `,
        [
            data.user_id,
            data.login_status,
            data.login_ip,
            data.device_name,
            data.session_id
        ]
    );
}

module.exports = {
    getUserByUsername,
    createLoginLog
};