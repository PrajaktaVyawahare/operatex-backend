// src/modules/route-station-master/route.query.js

module.exports = {

    // ==========================================================
    // CONFIG
    // ==========================================================

    GET_CONFIG: `

        SELECT

            rm.route_id,

            rm.route_code,

            rm.route_name,

            rm.revision,

            rm.is_active,

            rm.status,

            pm.part_code,

            pm.part_name,

            COUNT(DISTINCT rs.route_step_id) AS total_steps,

            COUNT(DISTINCT rvc.validation_id) AS total_validations

        FROM route_master rm

        INNER JOIN part_master pm
            ON rm.part_id = pm.part_id

        LEFT JOIN route_step rs
            ON rm.route_id = rs.route_id

        LEFT JOIN route_validation_config rvc
            ON rs.route_step_id = rvc.route_step_id

        GROUP BY

            rm.route_id,

            pm.part_code,

            pm.part_name

        ORDER BY

            rm.route_name;

    `,

    GET_CONFIG_BY_ID: `

        SELECT

            rm.*,

            pm.part_code,

            pm.part_name

        FROM route_master rm

        INNER JOIN part_master pm
            ON rm.part_id = pm.part_id

        WHERE rm.route_id = $1;

    `,

    // ==========================================================
    // MASTER
    // ==========================================================

    GET_MASTER: `

        SELECT

            rm.route_id,

            rm.route_code,

            rm.route_name,

            rm.revision,

            rm.is_active,

            rm.status,

            pm.part_code,

            pm.part_name

        FROM route_master rm

        INNER JOIN part_master pm
            ON rm.part_id = pm.part_id

        WHERE

            rm.status <> 'INACTIVE'

        ORDER BY

            rm.route_name;

    `,

    GET_MASTER_BY_ID: `

        SELECT

            rm.*,

            pm.part_code,

            pm.part_name

        FROM route_master rm

        INNER JOIN part_master pm
            ON rm.part_id = pm.part_id

        WHERE

            rm.route_id = $1;

    `,

    INSERT_MASTER: `

        INSERT INTO route_master
        (

            part_id,

            route_code,

            route_name,

            revision,

            is_active,

            status

        )

        VALUES
        (

            $1,$2,$3,$4,$5,$6

        )

        RETURNING *;

    `,

    CHECK_DUPLICATE_ROUTE_CODE: `

        SELECT

            route_id

        FROM route_master

        WHERE

            route_code = $1

        LIMIT 1;

    `,

    CHECK_DUPLICATE_ROUTE_NAME: `

        SELECT

            route_id

        FROM route_master

        WHERE

            LOWER(route_name)=LOWER($1)

        LIMIT 1;

    `,

    CHECK_DUPLICATE_ROUTE_CODE_FOR_UPDATE: `

        SELECT

            route_id

        FROM route_master

        WHERE

            route_code=$1

        AND

            route_id<>$2

        LIMIT 1;

    `,

    CHECK_DUPLICATE_ROUTE_NAME_FOR_UPDATE: `

        SELECT

            route_id

        FROM route_master

        WHERE

            LOWER(route_name)=LOWER($1)

        AND

            route_id<>$2

        LIMIT 1;

    `,

    UPDATE_MASTER: `
        -- Dynamic Query Generated in Repository
    `,

    DELETE_MASTER: `

        UPDATE route_master

        SET

            status='INACTIVE',

            updated_at=NOW()

        WHERE

            route_id=$1

        RETURNING *;

    `,
        // ==========================================================
    // CONFIG
    // ==========================================================

    INSERT_ROUTE_STEP: `

        INSERT INTO route_step
        (

            route_id,

            sequence_no,

            machine_id,

            station_id,

            operation_id,

            cycle_time,

            setup_time,

            status

        )

        VALUES
        (

            $1,$2,$3,$4,$5,$6,$7,$8

        )

        RETURNING *;

    `,

    INSERT_ROUTE_VALIDATION: `

        INSERT INTO route_validation_config
        (

            route_step_id,

            validation_name,

            expression,

            error_message,

            is_mandatory,

            status

        )

        VALUES
        (

            $1,$2,$3,$4,$5,$6

        )

        RETURNING *;

    `,

    // ==========================================================
    // RUNTIME
    // ==========================================================

    GET_RUNTIME: `

        SELECT

            ree.event_id,

            rm.route_code,

            rm.route_name,

            pm.part_code,

            pm.part_name,

            rs.sequence_no,

            sm.station_name,

            mm.machine_name,

            om.operation_name,

            ree.event_type,

            ree.event_time,

            ree.remarks,

            ree.created_by,

            ree.created_at

        FROM route_execution_event ree

        INNER JOIN route_master rm
            ON ree.route_id = rm.route_id

        INNER JOIN part_master pm
            ON rm.part_id = pm.part_id

        LEFT JOIN route_step rs
            ON ree.route_step_id = rs.route_step_id

        LEFT JOIN station_master sm
            ON ree.station_id = sm.station_id

        LEFT JOIN machine_master mm
            ON ree.machine_id = mm.machine_id

        LEFT JOIN operation_master om
            ON rs.operation_id = om.operation_id

        ORDER BY

            ree.event_time DESC;

    `,

    INSERT_RUNTIME: `

        INSERT INTO route_execution_event
        (

            route_id,

            route_step_id,

            station_id,

            machine_id,

            event_type,

            remarks,

            created_by

        )

        VALUES
        (

            $1,$2,$3,$4,$5,$6,$7

        )

        RETURNING *;

    `,

    // ==========================================================
    // REPORT
    // ==========================================================

    GET_REPORT: `

        SELECT

            rm.route_code,

            rm.route_name,

            rm.revision,

            pm.part_code,

            pm.part_name,

            rs.sequence_no,

            sm.station_name,

            mm.machine_name,

            om.operation_name,

            COUNT(DISTINCT rvc.validation_id)
                AS total_validations,

            COUNT(DISTINCT ree.event_id)
                AS total_execution,

            rm.status

        FROM route_master rm

        INNER JOIN part_master pm
            ON rm.part_id = pm.part_id

        LEFT JOIN route_step rs
            ON rm.route_id = rs.route_id

        LEFT JOIN station_master sm
            ON rs.station_id = sm.station_id

        LEFT JOIN machine_master mm
            ON rs.machine_id = mm.machine_id

        LEFT JOIN operation_master om
            ON rs.operation_id = om.operation_id

        LEFT JOIN route_validation_config rvc
            ON rs.route_step_id = rvc.route_step_id

        LEFT JOIN route_execution_event ree
            ON rm.route_id = ree.route_id

        WHERE

            ($1::integer IS NULL OR pm.part_id = $1)

        AND ($2::integer IS NULL OR sm.station_id = $2)

        AND ($3::integer IS NULL OR mm.machine_id = $3)

        AND ($4::varchar IS NULL OR rm.status = $4)

        GROUP BY

            rm.route_id,

            pm.part_code,

            pm.part_name,

            rs.sequence_no,

            sm.station_name,

            mm.machine_name,

            om.operation_name

        ORDER BY

            rm.route_name,

            rs.sequence_no;

    `

};