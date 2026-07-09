const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,

    max: 20,                    // max open connections
    idleTimeoutMillis: 30000,   // close idle connections
    connectionTimeoutMillis: 5000
});

pool.on("connect", () => {
    console.log("PostgreSQL connected");
});

pool.on("error", (err) => {
    console.error("Unexpected DB error:", err);
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
};