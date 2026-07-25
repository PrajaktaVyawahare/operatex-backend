// src/modules/tool-master/tool.query.js

module.exports = {

    // ==========================================================
    // CONFIG
    // ==========================================================

    GET_CONFIG: `
        SELECT

            tm.tool_id,
            tm.tool_no,
            tm.tool_name,
            tm.life_limit,
            tm.current_usage,
            tm.status,

            m.machine_name,

            tlc.life_source,
            tlc.warning_percent,
            tlc.critical_percent,

            tcc.calibration_type,
            tcc.calibration_interval,
            tcc.next_calibration

        FROM tool_master tm

        LEFT JOIN machine_master m
            ON tm.machine_id = m.machine_id

        LEFT JOIN tool_life_config tlc
            ON tm.tool_id = tlc.tool_id

        LEFT JOIN tool_calibration_config tcc
            ON tm.tool_id = tcc.tool_id

        ORDER BY
            tm.tool_no;
    `,

    GET_CONFIG_BY_ID: `
        SELECT

            tm.*,

            m.machine_name,

            tlc.life_source,
            tlc.warning_percent,
            tlc.critical_percent,

            tcc.calibration_type,
            tcc.calibration_interval,
            tcc.next_calibration

        FROM tool_master tm

        LEFT JOIN machine_master m
            ON tm.machine_id = m.machine_id

        LEFT JOIN tool_life_config tlc
            ON tm.tool_id = tlc.tool_id

        LEFT JOIN tool_calibration_config tcc
            ON tm.tool_id = tcc.tool_id

        WHERE tm.tool_id = $1;
    `,

    // ==========================================================
    // MASTER
    // ==========================================================

    GET_MASTER: `
        SELECT

            tm.tool_id,

            tm.tool_no,

            tm.tool_name,

            tm.tool_type,

            tm.manufacturer,

            tm.model_no,

            tm.life_limit,

            tm.warning_threshold,

            tm.critical_threshold,

            tm.current_usage,

            tm.unit,

            tm.status,

            m.machine_name

        FROM tool_master tm

        INNER JOIN machine_master m
            ON tm.machine_id = m.machine_id

        WHERE
            tm.status <> 'INACTIVE'

        ORDER BY
            tm.tool_no;
    `,

    GET_MASTER_BY_ID: `
        SELECT

            tm.*,

            m.machine_name

        FROM tool_master tm

        INNER JOIN machine_master m
            ON tm.machine_id = m.machine_id

        WHERE
            tm.tool_id = $1;
    `,

    INSERT_MASTER: `
        INSERT INTO tool_master
        (
            machine_id,
            tool_no,
            tool_name,
            tool_type,
            manufacturer,
            model_no,
            life_limit,
            warning_threshold,
            critical_threshold,
            current_usage,
            unit,
            status
        )
        VALUES
        (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
        )
        RETURNING *;
    `,

    CHECK_DUPLICATE_TOOL_NO: `
        SELECT
            tool_id
        FROM tool_master
        WHERE tool_no=$1
        LIMIT 1;
    `,

    CHECK_DUPLICATE_TOOL_NAME: `
        SELECT
            tool_id
        FROM tool_master
        WHERE LOWER(tool_name)=LOWER($1)
        LIMIT 1;
    `,

    CHECK_DUPLICATE_TOOL_NO_FOR_UPDATE: `
        SELECT
            tool_id
        FROM tool_master
        WHERE
            tool_no=$1
        AND
            tool_id<>$2
        LIMIT 1;
    `,

    CHECK_DUPLICATE_TOOL_NAME_FOR_UPDATE: `
        SELECT
            tool_id
        FROM tool_master
        WHERE
            LOWER(tool_name)=LOWER($1)
        AND
            tool_id<>$2
        LIMIT 1;
    `,

    UPDATE_MASTER: `
        -- Dynamic SQL generated in repository
    `,

    DELETE_MASTER: `
        UPDATE tool_master
        SET
            status='INACTIVE',
            updated_at=NOW()
        WHERE
            tool_id=$1
        RETURNING *;
    `,
        // ==========================================================
    // CONFIG
    // ==========================================================

    INSERT_LIFE_CONFIG: `
        INSERT INTO tool_life_config
        (
            tool_id,
            life_source,
            warning_percent,
            critical_percent,
            auto_lock,
            status
        )
        VALUES
        (
            $1,$2,$3,$4,$5,$6
        )
        RETURNING *;
    `,

    INSERT_CALIBRATION_CONFIG: `
        INSERT INTO tool_calibration_config
        (
            tool_id,
            calibration_type,
            calibration_interval,
            next_calibration,
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

            tm.tool_no,

            tm.tool_name,

            tue.event_id,

            tue.cycle_count,

            tue.usage_count,

            tue.event_ts,

            tre.replacement_id,

            tre.reason,

            tre.replaced_by,

            tre.replacement_date,

            toe.offset_id,

            toe.offset_no,

            toe.value,

            toe.delta

        FROM tool_master tm

        LEFT JOIN tool_usage_event tue
            ON tm.tool_id = tue.tool_id

        LEFT JOIN tool_replacement_event tre
            ON tm.tool_id = tre.tool_id

        LEFT JOIN tool_offset_event toe
            ON tm.tool_id = toe.tool_id

        ORDER BY
            tue.event_ts DESC NULLS LAST,
            tre.replacement_date DESC NULLS LAST;
    `,

    INSERT_USAGE_EVENT: `
        INSERT INTO tool_usage_event
        (
            tool_id,
            cycle_count,
            usage_count,
            remarks
        )
        VALUES
        (
            $1,$2,$3,$4
        )
        RETURNING *;
    `,

    INSERT_REPLACEMENT_EVENT: `
        INSERT INTO tool_replacement_event
        (
            tool_id,
            reason,
            replaced_by,
            remarks
        )
        VALUES
        (
            $1,$2,$3,$4
        )
        RETURNING *;
    `,

    INSERT_OFFSET_EVENT: `
        INSERT INTO tool_offset_event
        (
            tool_id,
            offset_no,
            value,
            delta
        )
        VALUES
        (
            $1,$2,$3,$4
        )
        RETURNING *;
    `,

    // ==========================================================
    // REPORT
    // ==========================================================

  GET_REPORT: `
    SELECT

        tm.tool_id,

        tm.tool_no,

        tm.tool_name,

        m.machine_name,

        tm.life_limit,

        tm.current_usage,

        ROUND(
            (
                tm.current_usage::numeric /
                NULLIF(tm.life_limit,0)
            ) * 100,
            2
        ) AS life_used_percent,

        tlc.warning_percent,

        tlc.critical_percent,

        COUNT(DISTINCT tue.event_id) AS total_usage_events,

        COUNT(DISTINCT tre.replacement_id) AS total_replacements

    FROM tool_master tm

    INNER JOIN machine_master m
        ON tm.machine_id = m.machine_id

    LEFT JOIN tool_life_config tlc
        ON tm.tool_id = tlc.tool_id

    LEFT JOIN tool_usage_event tue
        ON tm.tool_id = tue.tool_id

    LEFT JOIN tool_replacement_event tre
        ON tm.tool_id = tre.tool_id

    WHERE

        ($1::int IS NULL OR tm.machine_id = $1)

    AND

        ($2::varchar IS NULL OR tm.status = $2)

    GROUP BY

        tm.tool_id,
        tm.tool_no,
        tm.tool_name,
        tm.life_limit,
        tm.current_usage,
        m.machine_name,
        tlc.warning_percent,
        tlc.critical_percent

    ORDER BY

        tm.tool_no;
`,

};