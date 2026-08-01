// src/modules/gauge-instrument-master/gauge.query.js

module.exports = {

    // ==========================================================
    // CONFIG
    // ==========================================================

    GET_CONFIG: `
        SELECT

            gm.gauge_id,

            gm.gauge_no,

            gm.gauge_name,

            gm.gauge_type,

            gm.status,

            gpc.parameter_id,

            gpc.parameter_name,

            gpc.lsl,

            gpc.usl,

            gpc.unit,

            cs.schedule_id,

            cs.asset_type,

            cs.due_date,

            cs.frequency_days,

            cs.calibration_by

        FROM gauge_master gm

        LEFT JOIN gauge_parameter_config gpc
            ON gm.gauge_id = gpc.gauge_id

        LEFT JOIN calibration_schedule cs
            ON gm.gauge_id = cs.asset_id
            AND cs.asset_type = 'GAUGE'

        ORDER BY
            gm.gauge_no;
    `,

    GET_CONFIG_BY_ID: `
        SELECT

            gm.*,

            gpc.parameter_id,

            gpc.parameter_name,

            gpc.lsl,

            gpc.usl,

            gpc.unit,

            cs.schedule_id,

            cs.asset_type,

            cs.due_date,

            cs.frequency_days,

            cs.calibration_by

        FROM gauge_master gm

        LEFT JOIN gauge_parameter_config gpc
            ON gm.gauge_id = gpc.gauge_id

        LEFT JOIN calibration_schedule cs
            ON gm.gauge_id = cs.asset_id
            AND cs.asset_type = 'GAUGE'

        WHERE
            gm.gauge_id = $1;
    `,

    // ==========================================================
// CONFIG - PARAMETER
// ==========================================================

GET_PARAMETERS: `
    SELECT
        parameter_id,
        gauge_id,
        parameter_name,
        lsl,
        usl,
        unit,
        status,
        created_at,
        updated_at
    FROM gauge_parameter_config
    ORDER BY parameter_name;
`,

// ==========================================================
// CONFIG - CALIBRATION
// ==========================================================

GET_CALIBRATIONS: `
    SELECT
        schedule_id,
        asset_id,
        asset_type,
        due_date,
        frequency_days,
        calibration_by,
        status,
        created_at,
        updated_at
    FROM calibration_schedule
    WHERE asset_type = 'GAUGE'
    ORDER BY due_date;
`,

    // ==========================================================
    // MASTER
    // ==========================================================

    GET_MASTER: `
        SELECT

            gauge_id,

            gauge_no,

            gauge_name,

            gauge_type,

            manufacturer,

            model_no,

            serial_no,

           

            accuracy,

           

            location,

            status

        FROM gauge_master

        WHERE
            status <> 'INACTIVE'

        ORDER BY
            gauge_no;
    `,

    GET_MASTER_BY_ID: `
        SELECT *

        FROM gauge_master

        WHERE
            gauge_id = $1;
    `,

    INSERT_MASTER: `
        INSERT INTO gauge_master
        (
            gauge_no,
            gauge_name,
            gauge_type,
            manufacturer,
            model_no,
            serial_no,
            
            accuracy,
          
            location,
            status
        )
        VALUES
        (
            $1,$2,$3,$4,$5,$6,$7,$8,$9
        )
        RETURNING *;
    `,

    CHECK_DUPLICATE_GAUGE_NO: `
        SELECT
            gauge_id
        FROM gauge_master
        WHERE
            gauge_no = $1
        LIMIT 1;
    `,

    CHECK_DUPLICATE_GAUGE_NAME: `
        SELECT
            gauge_id
        FROM gauge_master
        WHERE
            LOWER(gauge_name)=LOWER($1)
        LIMIT 1;
    `,

    CHECK_DUPLICATE_GAUGE_NO_FOR_UPDATE: `
        SELECT
            gauge_id
        FROM gauge_master
        WHERE
            gauge_no=$1
        AND
            gauge_id<>$2
        LIMIT 1;
    `,

    CHECK_DUPLICATE_GAUGE_NAME_FOR_UPDATE: `
        SELECT
            gauge_id
        FROM gauge_master
        WHERE
            LOWER(gauge_name)=LOWER($1)
        AND
            gauge_id<>$2
        LIMIT 1;
    `,

    UPDATE_MASTER: `
        -- Dynamic SQL generated in repository
    `,

    DELETE_MASTER: `
        UPDATE gauge_master
        SET
            status='INACTIVE',
            updated_at=NOW()
        WHERE
            gauge_id=$1
        RETURNING *;
    `,
        // ==========================================================
    // CONFIG
    // ==========================================================

    INSERT_PARAMETER_CONFIG: `
        INSERT INTO gauge_parameter_config
        (
            gauge_id,
            parameter_name,
            lsl,
            usl,
            unit,
            status
        )
        VALUES
        (
            $1,$2,$3,$4,$5,$6
        )
        RETURNING *;
    `,

    INSERT_CALIBRATION_SCHEDULE: `
        INSERT INTO calibration_schedule
        (
            asset_id,
            asset_type,
            due_date,
            frequency_days,
            calibration_by,
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

            gm.gauge_id,

            gm.gauge_no,

            gm.gauge_name,

            gl.log_id,

            gl.parameter_name,

            gl.measured_value,

            gl.result,

            gl.remarks,

            gl.event_ts,

            ce.event_id,

            ce.result AS calibration_result,

            ce.certificate_path,

            ce.calibrated_by,

            ce.event_ts AS calibration_time

        FROM gauge_master gm

        LEFT JOIN gauge_log gl
            ON gm.gauge_id = gl.gauge_id

        LEFT JOIN calibration_event ce
            ON gm.gauge_id = ce.asset_id

        ORDER BY

            gl.event_ts DESC NULLS LAST,

            ce.event_ts DESC NULLS LAST;
    `,

    INSERT_GAUGE_LOG: `
        INSERT INTO gauge_log
        (
            gauge_id,
            parameter_name,
            measured_value,
            result,
            remarks
        )
        VALUES
        (
            $1,$2,$3,$4,$5
        )
        RETURNING *;
    `,

    INSERT_CALIBRATION_EVENT: `
        INSERT INTO calibration_event
        (
            asset_id,
            result,
            certificate_path,
            calibrated_by,
            remarks
        )
        VALUES
        (
            $1,$2,$3,$4,$5
        )
        RETURNING *;
    `,

    // ==========================================================
    // REPORT
    // ==========================================================

    GET_REPORT: `
        SELECT

            gm.gauge_id,

            gm.gauge_no,

            gm.gauge_name,

            gm.gauge_type,

            gpc.parameter_name,

            gpc.lsl,

            gpc.usl,

            gpc.unit,

            cs.due_date,

            gl.measured_value,

            gl.result AS inspection_result,

            ce.result AS calibration_result,

            gm.status

        FROM gauge_master gm

        LEFT JOIN gauge_parameter_config gpc
            ON gm.gauge_id = gpc.gauge_id

        LEFT JOIN calibration_schedule cs
            ON gm.gauge_id = cs.asset_id
            AND cs.asset_type='GAUGE'

        LEFT JOIN gauge_log gl
            ON gm.gauge_id = gl.gauge_id

        LEFT JOIN calibration_event ce
            ON gm.gauge_id = ce.asset_id

        WHERE

            ($1::varchar IS NULL OR gm.status = $1)

        ORDER BY

            gm.gauge_no;
    `

};