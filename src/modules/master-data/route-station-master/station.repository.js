// src/modules/route-station-master/station.repository.js

const db = require("../../../db/connection");
const query = require("./station.query");

// ==========================================================
// MASTER
// ==========================================================

async function getMaster() {

    const result = await db.query(
        query.GET_MASTER
    );

    return result.rows;

}

async function getMasterById(id) {

    const result = await db.query(

        query.GET_MASTER_BY_ID,

        [id]

    );

    return result.rows[0];

}

// ==========================================================
// CREATE MASTER
// ==========================================================

async function createMaster(payload) {

    const result = await db.query(

        query.INSERT_MASTER,

        [

            payload.line_id,

            payload.station_no,

            payload.station_name,

            payload.station_type,

            payload.status

        ]

    );

    return result.rows[0];

}

// ==========================================================
// UPDATE MASTER
// ==========================================================

async function updateMaster(id, payload) {

    const fields = [];

    const values = [];

    let index = 1;

    Object.keys(payload).forEach((key) => {

        fields.push(`${key}=$${index}`);

        values.push(payload[key]);

        index++;

    });

    fields.push("updated_at=NOW()");

    values.push(id);

    const sql = `

        UPDATE station_master

        SET

            ${fields.join(", ")}

        WHERE

            station_id=$${index}

        RETURNING *;

    `;

    const result = await db.query(

        sql,

        values

    );

    return result.rows[0];

}

// ==========================================================
// DELETE MASTER
// ==========================================================

async function deleteMaster(id) {

    const result = await db.query(

        query.DELETE_MASTER,

        [id]

    );

    return result.rows[0];

}

// ==========================================================
// DUPLICATE CHECKS
// ==========================================================

async function checkDuplicateStationNo(stationNo) {

    const result = await db.query(

        query.CHECK_DUPLICATE_STATION_NO,

        [stationNo]

    );

    return result.rows[0];

}

async function checkDuplicateStationName(stationName) {

    const result = await db.query(

        query.CHECK_DUPLICATE_STATION_NAME,

        [stationName]

    );

    return result.rows[0];

}

async function checkDuplicateStationNoForUpdate(stationNo, id) {

    const result = await db.query(

        query.CHECK_DUPLICATE_STATION_NO_FOR_UPDATE,

        [

            stationNo,

            id

        ]

    );

    return result.rows[0];

}

async function checkDuplicateStationNameForUpdate(stationName, id) {

    const result = await db.query(

        query.CHECK_DUPLICATE_STATION_NAME_FOR_UPDATE,

        [

            stationName,

            id

        ]

    );

    return result.rows[0];

}

// ==========================================================
// FK VALIDATION
// ==========================================================

async function checkLine(lineId) {

    const result = await db.query(

        `

        SELECT

            line_id,

            line_name

        FROM line_master

        WHERE line_id=$1

        `,

        [lineId]

    );

    return result.rows[0];

}

// ==========================================================
// EXPORTS
// ==========================================================

module.exports = {

    getMaster,

    getMasterById,

    createMaster,

    updateMaster,

    deleteMaster,

    checkDuplicateStationNo,

    checkDuplicateStationName,

    checkDuplicateStationNoForUpdate,

    checkDuplicateStationNameForUpdate,

    checkLine

};