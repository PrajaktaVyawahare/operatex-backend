const db = require("../../db/connection");

async function create(log) {
    await db.query(
        `
        INSERT INTO audit_log
        (
            action,
            module,
            user_id,
            entity_id,
            payload
        )
        VALUES ($1,$2,$3,$4,$5)
        `,
        [
            log.action,
            log.module,
            log.user_id,
            log.entity_id,
            JSON.stringify(log.payload)
        ]
    );
}

module.exports = { create };