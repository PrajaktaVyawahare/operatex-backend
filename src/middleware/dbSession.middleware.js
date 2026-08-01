const db = require("../db/connection");

async function dbSession(req, res, next) {

    const client = await db.pool.connect();

    try {

        req.db = client;

        if (req.user) {

            await client.query(
                `
                SELECT set_config(
                    'app.user_id',
                    $1,
                    false
                )
                `,
                [String(req.user.user_id)]
            );

        }

        next();

    } catch (err) {

        client.release();

        next(err);

    }

}

module.exports = { dbSession };