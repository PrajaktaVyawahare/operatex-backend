module.exports = {
    GET_CONFIG: `
        SELECT
            p.*,
            s.shop_id,
            s.shop_code,
            s.shop_name,
            l.line_id,
            l.line_code,
            l.line_name
        FROM plant_master p
        LEFT JOIN shop_master s
            ON p.plant_id = s.plant_id
        LEFT JOIN line_master l
            ON s.shop_id = l.shop_id
        ORDER BY p.created_at DESC
        LIMIT 1
    `,

    GET_MASTER: `
        SELECT
            p.plant_id,
            p.company_id,
            p.plant_code,
            p.plant_name,
            p.plant_type,
            p.status AS plant_status,

            s.shop_id,
            s.shop_code,
            s.shop_name,
            s.status AS shop_status,

            l.line_id,
            l.line_code,
            l.line_name,
            l.line_type,
            l.process_type,
            l.status AS line_status

        FROM plant_master p
        LEFT JOIN shop_master s
            ON p.plant_id = s.plant_id
        LEFT JOIN line_master l
            ON s.shop_id = l.shop_id
        ORDER BY p.created_at DESC
    `,

    INSERT_PLANT: `
        INSERT INTO plant_master
        (
            company_id,
            plant_code,
            plant_name,
            plant_type,
            timezone,
            state,
            city,
            address,
            status,
            remarks,
            created_by
        )
        VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
        RETURNING *
    `,

    INSERT_SHOP: `
        INSERT INTO shop_master
        (
            plant_id,
            shop_code,
            shop_name,
            status,
            created_by
        )
        VALUES
        ($1,$2,$3,$4,$5)
        RETURNING *
    `,

    GET_PLANT_BY_ID: `
        SELECT *
        FROM plant_master
        WHERE plant_id=$1
    `,

    GET_SHOP_BY_ID: `
        SELECT *
        FROM shop_master
        WHERE shop_id=$1
    `,

    UPDATE_PLANT: `
        UPDATE plant_master
        SET
            plant_code=$2,
            plant_name=$3,
            plant_type=$4,
            timezone=$5,
            state=$6,
            city=$7,
            address=$8,
            status=$9,
            remarks=$10,
            updated_by=$11,
            updated_at=NOW()
        WHERE plant_id=$1
        RETURNING *
    `,

    UPDATE_SHOP: `
        UPDATE shop_master
        SET
            shop_code=$2,
            shop_name=$3,
            status=$4,
            updated_by=$5,
            updated_at=NOW()
        WHERE shop_id=$1
        RETURNING *
    `,

    GET_RUNTIME: `
        SELECT *
        FROM audit_log
        WHERE module='plant_shop_master'
        ORDER BY created_at DESC
    `,

    GET_REPORT: `
        SELECT
            p.plant_name,
            s.shop_name,
            l.line_name,
            l.target_output,
            l.takt_time_sec,
            l.cycle_time_sec
        FROM plant_master p
        LEFT JOIN shop_master s
            ON p.plant_id=s.plant_id
        LEFT JOIN line_master l
            ON s.shop_id=l.shop_id
    `
};