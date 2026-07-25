// src/modules/process-master/process.query.js

module.exports = {

    // ==========================================================
    // CONFIG
    // ==========================================================

    GET_CONFIG: `

        SELECT

            pm.process_id,

            pm.process_code,

            pm.process_name,

            pt.part_code,

            pt.part_name,

            mm.machine_name,

            om.operation_name,

            COUNT(DISTINCT pr.revision_id) AS total_revisions

        FROM process_master pm

        INNER JOIN part_master pt
            ON pm.part_id = pt.part_id

        INNER JOIN machine_master mm
            ON pm.machine_id = mm.machine_id

        INNER JOIN operation_master om
            ON pm.operation_id = om.operation_id

        LEFT JOIN process_revision pr
            ON pm.process_id = pr.process_id

        GROUP BY

            pm.process_id,

            pt.part_code,

            pt.part_name,

            mm.machine_name,

            om.operation_name

        ORDER BY
            pm.process_code;

    `,
    // ==========================================================
// CONFIG - REVISION
// ==========================================================

GET_REVISIONS: `
    SELECT
        revision_id,
        process_id,
        revision_no,
        revision_description,
        effective_from,
        effective_to,
        is_current,
        status,
        created_at,
        updated_at
    FROM process_revision
    ORDER BY revision_no;
`,

// ==========================================================
// CONFIG - OPERATION
// ==========================================================

GET_OPERATIONS: `
    SELECT
        operation_id,
        operation_code,
        operation_name,
        operation_type,
        description,
        status,
        created_at,
        updated_at
    FROM operation_master
    ORDER BY operation_name;
`,

    GET_CONFIG_BY_ID: `

        SELECT

            pm.*,

            pt.part_code,

            pt.part_name,

            mm.machine_name,

            om.operation_name

        FROM process_master pm

        INNER JOIN part_master pt
            ON pm.part_id = pt.part_id

        INNER JOIN machine_master mm
            ON pm.machine_id = mm.machine_id

        INNER JOIN operation_master om
            ON pm.operation_id = om.operation_id

        WHERE pm.process_id=$1;

    `,

    // ==========================================================
    // MASTER
    // ==========================================================

    GET_MASTER: `

        SELECT

            pm.process_id,

            pm.process_code,

            pm.process_name,

            pt.part_code,

            pt.part_name,

            mm.machine_name,

            om.operation_name,

            pm.sequence_no,

            pm.cycle_time,

            pm.setup_time,

            pm.status

        FROM process_master pm

        INNER JOIN part_master pt
            ON pm.part_id = pt.part_id

        INNER JOIN machine_master mm
            ON pm.machine_id = mm.machine_id

        INNER JOIN operation_master om
            ON pm.operation_id = om.operation_id

        WHERE
            pm.status <> 'INACTIVE'

        ORDER BY
 pm.process_id ASC;

    `,

    GET_MASTER_BY_ID: `

        SELECT

            pm.*,

            pt.part_code,

            pt.part_name,

            mm.machine_name,

            om.operation_name

        FROM process_master pm

        INNER JOIN part_master pt
            ON pm.part_id = pt.part_id

        INNER JOIN machine_master mm
            ON pm.machine_id = mm.machine_id

        INNER JOIN operation_master om
            ON pm.operation_id = om.operation_id

        WHERE
            pm.process_id=$1;

    `,

    INSERT_MASTER: `

        INSERT INTO process_master
        (

            process_code,

            process_name,

            part_id,

            machine_id,

            operation_id,

            sequence_no,

            cycle_time,

            setup_time,

            status

        )

        VALUES
        (

            $1,$2,$3,$4,$5,$6,$7,$8,$9

        )

        RETURNING *;

    `,

    CHECK_DUPLICATE_PROCESS_CODE: `

        SELECT

            process_id

        FROM process_master

        WHERE process_code=$1

        LIMIT 1;

    `,

    CHECK_DUPLICATE_PROCESS_NAME: `

        SELECT

            process_id

        FROM process_master

        WHERE LOWER(process_name)=LOWER($1)

        LIMIT 1;

    `,

    CHECK_DUPLICATE_PROCESS_CODE_FOR_UPDATE: `

        SELECT

            process_id

        FROM process_master

        WHERE

            process_code=$1

        AND

            process_id<>$2

        LIMIT 1;

    `,

    CHECK_DUPLICATE_PROCESS_NAME_FOR_UPDATE: `

        SELECT

            process_id

        FROM process_master

        WHERE

            LOWER(process_name)=LOWER($1)

        AND

            process_id<>$2

        LIMIT 1;

    `,

    UPDATE_MASTER: `
        -- Dynamic Query
    `,

    DELETE_MASTER: `

        UPDATE process_master

        SET

            status='INACTIVE',

            updated_at=NOW()

        WHERE process_id=$1

        RETURNING *;

    `,
        // ==========================================================
    // CONFIG INSERT
    // ==========================================================

    INSERT_OPERATION: `

        INSERT INTO operation_master
        (

            operation_code,

            operation_name,

            operation_type,

            description,

            status

        )

        VALUES
        (

            $1,$2,$3,$4,$5

        )

        RETURNING *;

    `,

    INSERT_REVISION: `

        INSERT INTO process_revision
        (

            process_id,

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

    // ==========================================================
    // RUNTIME
    // ==========================================================

    GET_RUNTIME: `

        SELECT

            pe.event_id,

            pm.process_code,

            pm.process_name,

            pt.part_code,

            pt.part_name,

            mm.machine_name,

            om.operation_name,

            pr.revision_no,

            pe.event_type,

            pe.event_time,

            pe.remarks,

            pe.created_by,

            pe.created_at

        FROM process_event pe

        INNER JOIN process_master pm
            ON pe.process_id = pm.process_id

        INNER JOIN part_master pt
            ON pm.part_id = pt.part_id

        INNER JOIN machine_master mm
            ON pm.machine_id = mm.machine_id

        INNER JOIN operation_master om
            ON pm.operation_id = om.operation_id

        LEFT JOIN process_revision pr
            ON pe.revision_id = pr.revision_id

        ORDER BY

            pe.event_time DESC;

    `,

    INSERT_RUNTIME: `

        INSERT INTO process_event
        (

            process_id,

            revision_id,

            event_type,

            remarks,

            created_by

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

            pm.process_code,

            pm.process_name,

            pt.part_code,

            pt.part_name,

            mm.machine_name,

            om.operation_name,

            pm.sequence_no,

            pm.cycle_time,

            pm.setup_time,

            pm.status,

            COUNT(DISTINCT pr.revision_id) AS total_revisions,

            COUNT(DISTINCT pe.event_id) AS total_events

        FROM process_master pm

        INNER JOIN part_master pt
            ON pm.part_id = pt.part_id

        INNER JOIN machine_master mm
            ON pm.machine_id = mm.machine_id

        INNER JOIN operation_master om
            ON pm.operation_id = om.operation_id

        LEFT JOIN process_revision pr
            ON pm.process_id = pr.process_id

        LEFT JOIN process_event pe
            ON pm.process_id = pe.process_id

        WHERE

            ($1::integer IS NULL OR pt.part_id = $1)

        AND ($2::integer IS NULL OR mm.machine_id = $2)

        AND ($3::integer IS NULL OR om.operation_id = $3)

        AND ($4::varchar IS NULL OR pm.status = $4)

        GROUP BY

            pm.process_id,

            pt.part_code,

            pt.part_name,

            mm.machine_name,

            om.operation_name

        ORDER BY

            pm.sequence_no,

            pm.process_code;

    `

};