module.exports = {

    GET_CONFIG: `
        SELECT
            lm.line_id,
            lm.line_code,
            lm.line_name,
            lm.line_type,
            lm.process_type,
            lm.target_output,
            lm.takt_time_sec,
            
            lm.status,

            sm.station_id,
            sm.station_no,
            sm.station_name,
            sm.station_type,
            
            
            

            lc.layout_id,
            lc.layout_name,
            lc.layout_version,
            lc.layout_type,
            lc.is_default

        FROM line_master lm
        LEFT JOIN station_master sm
            ON lm.line_id = sm.line_id
        LEFT JOIN layout_config lc
            ON lm.line_id = lc.line_id

        ORDER BY lm.created_at DESC
        LIMIT 1
    `,

    GET_MASTER: `
        SELECT
            lm.line_id,
            lm.plant_id,
            lm.shop_id,
            lm.line_code,
            lm.line_name,
            lm.line_type,
            lm.process_type,
            lm.target_output,
            lm.takt_time_sec,
            lm.cycle_time_sec,
            lm.status,
            lm.remarks,

            sm.station_id,
            sm.station_no,
            sm.station_name,
            sm.station_type,
            
            

            lc.layout_id,
            lc.layout_name,
            lc.layout_version,
            lc.layout_type,
            lc.width,
            lc.height,
            lc.is_default

        FROM line_master lm

        LEFT JOIN station_master sm
            ON lm.line_id = sm.line_id

        LEFT JOIN layout_config lc
            ON lm.line_id = lc.line_id

        ORDER BY
            lm.created_at DESC,
            sm.station_no ASC
    `,

    GET_BY_ID: `
        SELECT *
        FROM line_master
        WHERE line_id=$1
    `,

    INSERT: `
        INSERT INTO line_master
        (
            plant_id,
            shop_id,
            line_code,
            line_name,
            line_type,
            process_type,
            target_output,
            takt_time_sec,
            cycle_time_sec,
            status,
            remarks
        )
        VALUES
        (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11
        )
        RETURNING *
    `,

    UPDATE: `
        UPDATE line_master
        SET
            line_code=$2,
            line_name=$3,
            line_type=$4,
            process_type=$5,
            target_output=$6,
            takt_time_sec=$7,
            cycle_time_sec=$8,
            status=$9,
            remarks=$10,
            version=version+1,
            updated_at=NOW()

        WHERE line_id=$1

        RETURNING *
    `,

    GET_RUNTIME: `
        SELECT *
        FROM audit_log
        WHERE module='line_master'
        ORDER BY created_at DESC
    `,

    GET_REPORT: `
        SELECT

            lm.line_code,
            lm.line_name,

            sm.station_no,
            sm.station_name,

            lc.layout_name,
            lc.layout_version,

            lm.target_output,
            lm.takt_time_sec,
            lm.cycle_time_sec,

            lm.status

        FROM line_master lm

        LEFT JOIN station_master sm
            ON lm.line_id=sm.line_id

        LEFT JOIN layout_config lc
            ON lm.line_id=lc.line_id

        ORDER BY
            lm.line_code,
            sm.station_no
    `,

    GET_LAYOUT_BY_LINE: `
        SELECT *
        FROM layout_config
        WHERE line_id=$1
    `,

    GET_STATIONS: `
        SELECT *
        FROM station_master
        WHERE line_id=$1
        ORDER BY station_no
    `

};