// src/modules/machine-master/machine.query.js

module.exports = {

    // ==========================================================
    // CONFIG
    // ==========================================================

    GET_CONFIG: `
        SELECT
            mm.machine_id,
            mm.machine_name,
            mm.status,
            COUNT(DISTINCT mc.capability_id) AS total_capabilities,
            COUNT(DISTINCT mg.group_id) AS total_groups
        FROM machine_master mm
        LEFT JOIN machine_capability_config mc
            ON mm.machine_id = mc.machine_id
        LEFT JOIN machine_group_config mg
            ON mm.machine_id = mg.machine_id
        GROUP BY
            mm.machine_id,
            mm.machine_name,
            mm.status
        ORDER BY mm.machine_name;
    `,

    // ==========================================================
    // MASTER
    // ==========================================================

    GET_MASTER: `
        SELECT
            m.machine_id,
            m.machine_name,
            m.make_model,
            m.controller_make_model,
            m.installed_date,
            m.location,
            l.line_name,
            m.communication_protocol,
            m.tool_count,
            m.power_rating,
            m.no_of_spindels,
            m.no_of_servo,
            m.no_of_encoder,
            m.no_of_batteries,
            m.status,
            m.bottleneck,
            m.created_at,
            m.updated_at
        FROM machine_master m
        INNER JOIN line_master l
            ON m.location = l.line_id
        ORDER BY m.machine_name;
    `,

    GET_MACHINE_BY_ID: `
        SELECT *
        FROM machine_master
        WHERE machine_id = $1;
    `,

    INSERT_MACHINE: `
        INSERT INTO machine_master
        (
            machine_name,
            make_model,
            controller_make_model,
            installed_date,
            location,
            communication_protocol,
            tool_count,
            power_rating,
            no_of_spindels,
            no_of_servo,
            no_of_encoder,
            no_of_batteries,
            status,
            bottleneck
        )
        VALUES
        (
            $1,$2,$3,$4,$5,$6,$7,
            $8,$9,$10,$11,$12,$13,$14
        )
        RETURNING *;
    `,

    UPDATE_MACHINE: `
        UPDATE machine_master
        SET
            machine_name=$2,
            make_model=$3,
            controller_make_model=$4,
            installed_date=$5,
            location=$6,
            communication_protocol=$7,
            tool_count=$8,
            power_rating=$9,
            no_of_spindels=$10,
            no_of_servo=$11,
            no_of_encoder=$12,
            no_of_batteries=$13,
            status=$14,
            bottleneck=$15,
            updated_at=NOW()
        WHERE machine_id=$1
        RETURNING *;
    `,

    // ==========================================================
    // CAPABILITY
    // ==========================================================

    GET_CAPABILITIES: `
        SELECT
            capability_id,
            machine_id,
            capability_name,
            capability_value,
            unit,
            status,
            remarks
        FROM machine_capability_config
        ORDER BY capability_name;
    `,

    INSERT_CAPABILITY: `
        INSERT INTO machine_capability_config
        (
            machine_id,
            capability_name,
            capability_value,
            unit,
            status,
            remarks
        )
        VALUES
        (
            $1,$2,$3,$4,$5,$6
        )
        RETURNING *;
    `,

    // ==========================================================
    // MACHINE GROUP
    // ==========================================================

    GET_GROUPS: `
        SELECT
            group_id,
            machine_id,
            group_code,
            group_name,
            description,
            status
        FROM machine_group_config
        ORDER BY group_name;
    `,

    INSERT_GROUP: `
        INSERT INTO machine_group_config
        (
            machine_id,
            group_code,
            group_name,
            description,
            status
        )
        VALUES
        (
            $1,$2,$3,$4,$5
        )
        RETURNING *;
    `,

    // ==========================================================
    // RUNTIME
    // ==========================================================

    GET_RUNTIME: `
        SELECT
            mse.event_id,
            m.machine_name,
            mse.status,
            mse.is_available,
            mse.mode,
            mse.reason_code,
            mse.event_ts,
            mse.remarks
        FROM machine_status_event mse
        INNER JOIN machine_master m
            ON mse.machine_id = m.machine_id
        ORDER BY mse.event_ts DESC;
    `,

    INSERT_RUNTIME_EVENT: `
        INSERT INTO machine_status_event
        (
            machine_id,
            status,
            is_available,
            mode,
            reason_code,
            remarks
        )
        VALUES
        (
            $1,$2,$3,$4,$5,$6
        )
        RETURNING *;
    `,

    // ==========================================================
    // REPORT
    // ==========================================================

    GET_REPORT: `
        SELECT
            m.machine_id,
            m.machine_name,
            l.line_name,
            m.status,
            m.bottleneck,
            COUNT(DISTINCT mc.capability_id) AS capability_count,
            COUNT(DISTINCT mg.group_id) AS group_count,
            MAX(mse.event_ts) AS last_event
        FROM machine_master m
        INNER JOIN line_master l
            ON m.location = l.line_id
        LEFT JOIN machine_capability_config mc
            ON m.machine_id = mc.machine_id
        LEFT JOIN machine_group_config mg
            ON m.machine_id = mg.machine_id
        LEFT JOIN machine_status_event mse
            ON m.machine_id = mse.machine_id
        GROUP BY
            m.machine_id,
            m.machine_name,
            l.line_name,
            m.status,
            m.bottleneck
        ORDER BY m.machine_name;
    `

};