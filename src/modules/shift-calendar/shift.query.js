// src/modules/shift-calendar/shift.query.js

module.exports = {

    // ==========================================================
    // CONFIG
    // ==========================================================

    GET_CONFIG: `
        SELECT
            sm.shift_id,
            sm.shift_no,
            sm.shift_name,
            sm.shift_start_time,
            sm.shift_end_time,
            sm.shift_duration,
            sm.is_night_shift,
            sm.status,
            lm.line_id,
            lm.line_name,

            COUNT(DISTINCT sc.calendar_id) AS total_calendar,

            COUNT(DISTINCT bc.break_id) AS total_breaks,

            COUNT(DISTINCT hc.holiday_id) AS total_holidays

        FROM shift_master sm

        LEFT JOIN line_master lm
            ON sm.line_id = lm.line_id

        LEFT JOIN shift_calendar sc
            ON sm.shift_id = sc.shift_id

        LEFT JOIN break_config bc
            ON sm.shift_id = bc.shift_id

        LEFT JOIN holiday_calendar hc
ON hc.plant_id = lm.plant_id
AND hc.holiday_date = sc.work_date

        GROUP BY

            sm.shift_id,

            lm.line_id,

            lm.line_name

        ORDER BY sm.shift_no;
    `,

    GET_CONFIG_BY_ID: `
        SELECT
            sm.*,
            lm.line_name
        FROM shift_master sm
        LEFT JOIN line_master lm
            ON sm.line_id = lm.line_id
        WHERE sm.shift_id=$1;
    `,

    // ==========================================================
    // MASTER
    // ==========================================================

    GET_MASTER: `
        SELECT

            sm.shift_id,

            sm.shift_no,

            sm.shift_name,

            sm.shift_start_time,

            sm.shift_end_time,

            sm.shift_duration,

            sm.is_night_shift,

            sm.status,

            lm.line_name,

            pm.plant_name 

           

        FROM shift_master sm

        INNER JOIN line_master lm
            ON sm.line_id=lm.line_id

       INNER JOIN plant_master pm
ON lm.plant_id = pm.plant_id

        WHERE sm.status<>'INACTIVE'

        ORDER BY
            sm.shift_no;
    `,

    GET_MASTER_BY_ID: `
        SELECT

            sm.*,

            lm.line_name,

          pm.plant_name

        FROM shift_master sm

        INNER JOIN line_master lm
            ON sm.line_id=lm.line_id

       INNER JOIN plant_master pm
ON lm.plant_id = pm.plant_id

        WHERE sm.shift_id=$1;
    `,

    INSERT_MASTER: `
        INSERT INTO shift_master
        (
            shift_no,
            shift_name,
            shift_start_time,
            shift_end_time,
            shift_duration,
            is_night_shift,
            line_id,
            status
        )
        VALUES
        (
            $1,$2,$3,$4,$5,$6,$7,$8
        )
        RETURNING *;
    `,

    CHECK_DUPLICATE_SHIFT_NO: `
        SELECT shift_id
        FROM shift_master
        WHERE shift_no=$1
        LIMIT 1;
    `,

    CHECK_DUPLICATE_SHIFT_NAME: `
        SELECT shift_id
        FROM shift_master
        WHERE LOWER(shift_name)=LOWER($1)
        LIMIT 1;
    `,
    CHECK_DUPLICATE_SHIFT_NO_FOR_UPDATE: `

    SELECT
        shift_id
    FROM shift_master
    WHERE
        shift_no = $1
    AND
        shift_id <> $2
    LIMIT 1;

`,

CHECK_DUPLICATE_SHIFT_NAME_FOR_UPDATE: `

    SELECT
        shift_id
    FROM shift_master
    WHERE
        LOWER(shift_name) = LOWER($1)
    AND
        shift_id <> $2
    LIMIT 1;

`,

    // Repository will build dynamic SQL
    UPDATE_MASTER: `
        -- Dynamic query generated in repository
    `,

    DELETE_MASTER: `
        UPDATE shift_master

        SET

            status='INACTIVE',

            updated_at=NOW()

        WHERE shift_id=$1

        RETURNING *;
    `,

    // ==========================================================
    // CONFIG UPDATE
    // ==========================================================

    INSERT_BREAK: `
        INSERT INTO break_config
        (
            shift_id,
            break_name,
            break_start_time,
            break_end_time,
            include_in_oee,
            status
        )
        VALUES
        (
            $1,$2,$3,$4,$5,$6
        )
        RETURNING *;
    `,

    INSERT_CALENDAR: `
        INSERT INTO shift_calendar
        (
            shift_id,
            work_date,
            shift_status,
            remarks
        )
        VALUES
        (
            $1,$2,$3,$4
        )
        RETURNING *;
    `,

    INSERT_HOLIDAY: `
        INSERT INTO holiday_calendar
        (
            plant_id,
            holiday_date,
            reason,
            is_paid
        )
        VALUES
        (
            $1,$2,$3,$4
        )
        RETURNING *;
    `,

    // ==========================================================
    // RUNTIME
    // ==========================================================

    GET_RUNTIME: `
        SELECT

            srl.runtime_id,

            sm.shift_name,

            sc.work_date,

            bc.break_name,

            hc.reason AS holiday_reason,

            srl.runtime_status,

            srl.actual_start_time,

            srl.actual_end_time,

            srl.created_at

        FROM shift_runtime_log srl

        INNER JOIN shift_master sm
            ON srl.shift_id=sm.shift_id

        LEFT JOIN shift_calendar sc
            ON srl.calendar_id=sc.calendar_id

        LEFT JOIN break_config bc
            ON srl.break_id=bc.break_id

        LEFT JOIN holiday_calendar hc
            ON srl.holiday_id=hc.holiday_id

        ORDER BY
            srl.created_at DESC;
    `,

    GET_RUNTIME_DATA: `
SELECT

    sm.shift_id,

    sc.calendar_id,

    bc.break_id,

    hc.holiday_id,

    sm.shift_start_time,

    sm.shift_end_time

FROM shift_master sm

LEFT JOIN shift_calendar sc
    ON sm.shift_id = sc.shift_id
    AND sc.work_date = CURRENT_DATE

LEFT JOIN break_config bc
    ON sm.shift_id = bc.shift_id
    AND bc.status='ACTIVE'

LEFT JOIN line_master lm
    ON sm.line_id=lm.line_id

LEFT JOIN holiday_calendar hc
    ON hc.plant_id=lm.plant_id
    AND hc.holiday_date=CURRENT_DATE

WHERE sm.shift_id=$1;
`,

    INSERT_RUNTIME: `
        INSERT INTO shift_runtime_log
        (
            shift_id,
            calendar_id,
            break_id,
            holiday_id,
            runtime_date,
            shift_start_time,
            shift_end_time,
            actual_start_time,
            actual_end_time,
            runtime_status,
            remarks
        )
        VALUES
        (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11
        )
        RETURNING *;
    `,

    // ==========================================================
    // REPORT
    // ==========================================================

    GET_REPORT: `
        SELECT

            sm.shift_no,

            sm.shift_name,

            lm.line_name,

            pm.plant_name,

            sc.work_date,

            sc.shift_status,

            COUNT(DISTINCT bc.break_id) AS total_breaks,

            COUNT(DISTINCT hc.holiday_id) AS holidays,

            COUNT(DISTINCT srl.runtime_id) AS runtime_events

        FROM shift_master sm

        INNER JOIN line_master lm
            ON sm.line_id=lm.line_id

        INNER JOIN plant_master pm
ON lm.plant_id=pm.plant_id

        LEFT JOIN shift_calendar sc
            ON sm.shift_id=sc.shift_id

        LEFT JOIN break_config bc
            ON sm.shift_id=bc.shift_id

        LEFT JOIN holiday_calendar hc
            ON hc.plant_id=pm.plant_id
            AND hc.holiday_date=sc.work_date

        LEFT JOIN shift_runtime_log srl
            ON sm.shift_id=srl.shift_id

        WHERE

            ($1::uuid IS NULL OR lm.line_id=$1)

        AND ($2::varchar IS NULL OR sm.status=$2)

        AND ($3::date IS NULL OR sc.work_date >= $3)

        AND ($4::date IS NULL OR sc.work_date <= $4)

        GROUP BY

            sm.shift_id,

            lm.line_name,

            pm.plant_name,

            sc.work_date,

            sc.shift_status

        ORDER BY

            sc.work_date DESC,

            sm.shift_no;
    `

};