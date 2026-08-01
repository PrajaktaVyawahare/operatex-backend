const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({

    host: process.env.DB_HOST,

    port: Number(process.env.DB_PORT),

    database: process.env.DB_NAME,

    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,

    max: 20,

    idleTimeoutMillis: 30000,

    connectionTimeoutMillis: 5000

});

pool.on("connect", () => {

    console.log("PostgreSQL connected");

});

pool.on("error", (err) => {

    console.error("Unexpected DB error:", err);

});

async function query(text, params) {

    const client =
        await pool.connect();

    try {

        await client.query(

            `
            SELECT set_config(
                'app.user_id',
                $1,
                false
            )
            `,

            [

                String(
                    global.currentUserId || 0
                )

            ]

        );

        const result =
            await client.query(
                text,
                params
            );

        return result;

    }

    finally {

        client.release();

    }

}

module.exports = {

    query,

    pool

};