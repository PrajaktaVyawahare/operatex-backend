// src/modules/route-station-master/station.query.js

module.exports = {

    // ==========================================================
    // MASTER
    // ==========================================================

    GET_MASTER: `

        SELECT

            sm.station_id,

            sm.station_no,

            sm.station_name,

            sm.station_type,

            sm.status,

            lm.line_id,

            lm.line_name

        FROM station_master sm

        INNER JOIN line_master lm

            ON sm.line_id = lm.line_id

        WHERE

            sm.status <> 'INACTIVE'

        ORDER BY

            sm.station_no;

    `,

    GET_MASTER_BY_ID: `

        SELECT

            sm.*,

            lm.line_name

        FROM station_master sm

        INNER JOIN line_master lm

            ON sm.line_id = lm.line_id

        WHERE

            sm.station_id = $1;

    `,

    INSERT_MASTER: `

        INSERT INTO station_master
        (

            line_id,

            station_no,

            station_name,

            station_type,

            status

        )

        VALUES
        (

            $1,$2,$3,$4,$5

        )

        RETURNING *;

    `,

    CHECK_DUPLICATE_STATION_NO: `

        SELECT

            station_id

        FROM station_master

        WHERE

            station_no = $1

        LIMIT 1;

    `,

    CHECK_DUPLICATE_STATION_NAME: `

        SELECT

            station_id

        FROM station_master

        WHERE

            LOWER(station_name)=LOWER($1)

        LIMIT 1;

    `,

    CHECK_DUPLICATE_STATION_NO_FOR_UPDATE: `

        SELECT

            station_id

        FROM station_master

        WHERE

            station_no=$1

        AND

            station_id<>$2

        LIMIT 1;

    `,

    CHECK_DUPLICATE_STATION_NAME_FOR_UPDATE: `

        SELECT

            station_id

        FROM station_master

        WHERE

            LOWER(station_name)=LOWER($1)

        AND

            station_id<>$2

        LIMIT 1;

    `,

    UPDATE_MASTER: `
        -- Dynamic SQL generated in repository
    `,

    DELETE_MASTER: `

        UPDATE station_master

        SET

            status='INACTIVE',

            updated_at=NOW()

        WHERE

            station_id=$1

        RETURNING *;

    `

};