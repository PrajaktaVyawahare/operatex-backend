// src/modules/part-master/part.query.js

module.exports = {

    // ==========================================================
    // CONFIG
    // ==========================================================

    GET_CONFIG: `
        SELECT

            pm.part_id,

            pm.part_code,

            pm.part_name,

            pm.revision_no,

            pm.status,

            COUNT(DISTINCT pr.revision_id) AS total_revisions,

            COUNT(DISTINCT pac.attribute_id) AS total_attributes

        FROM part_master pm

        LEFT JOIN part_revision pr
            ON pm.part_id = pr.part_id
            AND pr.status = 'ACTIVE'

        LEFT JOIN part_attribute_config pac
            ON pm.part_id = pac.part_id
            AND pac.status = 'ACTIVE'

        WHERE pm.status <> 'INACTIVE'

        GROUP BY

            pm.part_id,

            pm.part_code,

            pm.part_name,

            pm.revision_no,

            pm.status

        ORDER BY
            pm.part_code;
    `,

    GET_CONFIG_BY_ID: `
        SELECT

            pm.*

        FROM part_master pm

        WHERE
            pm.part_id = $1;
    `,

    // ==========================================================
    // MASTER
    // ==========================================================

    GET_MASTER: `
        SELECT

            pm.part_id,

            pm.part_code,

            pm.part_name,

            pm.drawing_no,

            pm.revision_no,

            pm.customer,

            pm.product_family,

            pm.material,

            pm.weight_kg,

            pm.length_mm,

            pm.width_mm,

            pm.height_mm,

            pm.max_production_per_day,

            pm.takt_time,

            pm.status

        FROM part_master pm

        WHERE
            pm.status <> 'INACTIVE'

        ORDER BY
            pm.part_code;
    `,

    GET_MASTER_BY_ID: `
        SELECT

            *

        FROM part_master

        WHERE
            part_id = $1;
    `,

    INSERT_MASTER: `
        INSERT INTO part_master
        (
            part_code,
            part_name,
            drawing_no,
            revision_no,
            customer,
            product_family,
            material,
            weight_kg,
            length_mm,
            width_mm,
            height_mm,
            max_production_per_day,
            takt_time,
            status
        )
        VALUES
        (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14
        )
        RETURNING *;
    `,

    UPDATE_MASTER: `
        -- Dynamic SQL generated in repository
    `,

    DELETE_MASTER: `
        UPDATE part_master

        SET

            status='INACTIVE',

            updated_at=NOW()

        WHERE
            part_id=$1

        RETURNING *;
    `,

    // ==========================================================
    // CONFIG INSERT
    // ==========================================================

    INSERT_REVISION: `
        INSERT INTO part_revision
        (
            part_id,
            revision_no,
            revision_description,
            effective_from,
            effective_to,
            is_current,
            status
        )
        VALUES
        (
            $1,$2,$3,$4,$5,$6,$7
        )
        RETURNING *;
    `,

    INSERT_ATTRIBUTE: `
        INSERT INTO part_attribute_config
        (
            part_id,
            attribute_key,
            attribute_value,
            display_order,
            status
        )
        VALUES
        (
            $1,$2,$3,$4,$5
        )
        RETURNING *;
    `,

    // ==========================================================
    // DUPLICATE CHECKS
    // ==========================================================

    CHECK_DUPLICATE_PART_CODE: `
        SELECT

            part_id

        FROM part_master

        WHERE
            LOWER(part_code)=LOWER($1)

        LIMIT 1;
    `,

    CHECK_DUPLICATE_PART_NAME: `
        SELECT

            part_id

        FROM part_master

        WHERE
            LOWER(part_name)=LOWER($1)

        LIMIT 1;
    `,

    CHECK_DUPLICATE_PART_CODE_FOR_UPDATE: `
        SELECT

            part_id

        FROM part_master

        WHERE
            LOWER(part_code)=LOWER($1)

        AND
            part_id<>$2

        LIMIT 1;
    `,

    CHECK_DUPLICATE_PART_NAME_FOR_UPDATE: `
        SELECT

            part_id

        FROM part_master

        WHERE
            LOWER(part_name)=LOWER($1)

        AND
            part_id<>$2

        LIMIT 1;
    `,
        // ==========================================================
    // CONFIG UPDATE
    // ==========================================================

    UPDATE_CONFIG: `
        -- Dynamic SQL generated in repository
    `,

    DELETE_REVISION: `
        UPDATE part_revision

        SET
            status='INACTIVE',
            updated_at=NOW()

        WHERE revision_id=$1

        RETURNING *;
    `,

    DELETE_ATTRIBUTE: `
        UPDATE part_attribute_config

        SET
            status='INACTIVE',
            updated_at=NOW()

        WHERE attribute_id=$1

        RETURNING *;
    `,

    // ==========================================================
    // RUNTIME
    // ==========================================================

    GET_RUNTIME: `
        SELECT

            pe.event_id,

            pm.part_id,

            pm.part_code,

            pm.part_name,

            pr.revision_no,

            pe.event_type,

            pe.event_time,

            pe.remarks,

            pe.created_by,

            pe.created_at

        FROM part_event pe

        INNER JOIN part_master pm
            ON pe.part_id = pm.part_id

        LEFT JOIN part_revision pr
            ON pe.revision_id = pr.revision_id

        WHERE

            ($1::integer IS NULL OR pm.part_id = $1)

        AND

            ($2::varchar IS NULL OR pe.event_type = $2)

        AND

            ($3::date IS NULL OR pe.event_time::date >= $3)

        AND

            ($4::date IS NULL OR pe.event_time::date <= $4)

        ORDER BY

            pe.event_time DESC;
    `,

    INSERT_EVENT: `
        INSERT INTO part_event
        (
            part_id,
            revision_id,
            event_type,
            event_time,
            remarks,
            created_by
        )
        VALUES
        (
            $1,$2,$3,NOW(),$4,$5
        )
        RETURNING *;
    `,

    // ==========================================================
    // REPORT
    // ==========================================================

    GET_REPORT: `
        SELECT

            pm.part_code,

            pm.part_name,

            pm.customer,

            pm.product_family,

            pm.material,

            pm.revision_no,

            COUNT(DISTINCT pr.revision_id)
                AS total_revisions,

            COUNT(DISTINCT pac.attribute_id)
                AS total_attributes,

            COUNT(DISTINCT pe.event_id)
                AS total_events,

            pm.status

        FROM part_master pm

        LEFT JOIN part_revision pr
            ON pm.part_id = pr.part_id
            AND pr.status='ACTIVE'

        LEFT JOIN part_attribute_config pac
            ON pm.part_id = pac.part_id
            AND pac.status='ACTIVE'

        LEFT JOIN part_event pe
            ON pm.part_id = pe.part_id

        WHERE

            ($1::varchar IS NULL
                OR pm.status = $1)

        AND

            ($2::varchar IS NULL
                OR pm.customer = $2)

        AND

            ($3::varchar IS NULL
                OR pm.product_family = $3)

        GROUP BY

            pm.part_id,

            pm.part_code,

            pm.part_name,

            pm.customer,

            pm.product_family,

            pm.material,

            pm.revision_no,

            pm.status

        ORDER BY

            pm.part_code;
    `

};