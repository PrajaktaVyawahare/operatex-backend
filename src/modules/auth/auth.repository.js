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
async function getActiveSession(userId) {

    const result = await db.query(
        `
        SELECT *
        FROM login_log
        WHERE user_id = $1
          AND logout_time IS NULL
        ORDER BY login_time DESC
        LIMIT 1
        `,
        [userId]
    );

    return result.rows[0];
}
async function logout(sessionId) {

    await db.query(
        `
        UPDATE login_log
        SET logout_time = NOW()
        WHERE session_id = $1
          AND logout_time IS NULL
        `,
        [sessionId]
    );

}

module.exports = {
    getUserByUsername,
    createLoginLog,
    getActiveSession,
       logout
};