// src/modules/document-sop-master/document.query.js

module.exports = {

    // ==========================================================
    // CONFIG
    // ==========================================================

    GET_CONFIG: `
        SELECT

            dm.document_id,

            dm.document_no,

            dm.document_name,

            dm.document_type,

            dm.category,

            dm.department,

            dm.status,

            dr.revision_id,

            dr.revision_no,

            dr.effective_from,

            dr.effective_to,

            dr.approved_by,

            dac.access_id,

            dac.role_name,

            dac.can_view,

            dac.can_download,

            dac.can_print

        FROM document_master dm

        LEFT JOIN document_revision dr

            ON dm.document_id = dr.document_id

        LEFT JOIN document_access_config dac

            ON dm.document_id = dac.document_id

        ORDER BY

            dm.document_no;

    `,

    GET_CONFIG_BY_ID: `
        SELECT

            dm.*,

            dr.revision_id,

            dr.revision_no,

            dr.effective_from,

            dr.effective_to,

            dr.change_description,

            dr.approved_by,

            dac.access_id,

            dac.role_name,

            dac.can_view,

            dac.can_download,

            dac.can_print

        FROM document_master dm

        LEFT JOIN document_revision dr

            ON dm.document_id = dr.document_id

        LEFT JOIN document_access_config dac

            ON dm.document_id = dac.document_id

        WHERE

            dm.document_id = $1;

    `,

    // ==========================================================
    // MASTER
    // ==========================================================

    GET_MASTER: `
        SELECT

            document_id,

            document_no,

            document_name,

            document_type,

            category,

            department,

            file_name,

            file_path,

            description,

            status

        FROM document_master

        WHERE

            status <> 'INACTIVE'

        ORDER BY

            document_no;

    `,

    GET_MASTER_BY_ID: `
        SELECT *

        FROM document_master

        WHERE

            document_id = $1;

    `,

    INSERT_MASTER: `
        INSERT INTO document_master
        (

            document_no,

            document_name,

            document_type,

            category,

            department,

            file_name,

            file_path,

            description,

            status

        )
        VALUES
        (

            $1,$2,$3,$4,$5,$6,$7,$8,$9

        )
        RETURNING *;

    `,

    CHECK_DUPLICATE_DOCUMENT_NO: `
        SELECT

            document_id

        FROM document_master

        WHERE

            document_no = $1

        LIMIT 1;

    `,

    CHECK_DUPLICATE_DOCUMENT_NAME: `
        SELECT

            document_id

        FROM document_master

        WHERE

            LOWER(document_name)=LOWER($1)

        LIMIT 1;

    `,

    CHECK_DUPLICATE_DOCUMENT_NO_FOR_UPDATE: `
        SELECT

            document_id

        FROM document_master

        WHERE

            document_no=$1

        AND

            document_id<>$2

        LIMIT 1;

    `,

    CHECK_DUPLICATE_DOCUMENT_NAME_FOR_UPDATE: `
        SELECT

            document_id

        FROM document_master

        WHERE

            LOWER(document_name)=LOWER($1)

        AND

            document_id<>$2

        LIMIT 1;

    `,

    UPDATE_MASTER: `
        -- Dynamic SQL generated in repository
    `,

    DELETE_MASTER: `
        UPDATE document_master

        SET

            status='INACTIVE',

            updated_at=NOW()

        WHERE

            document_id=$1

        RETURNING *;

    `,
        // ==========================================================
    // CONFIG
    // ==========================================================

    INSERT_DOCUMENT_REVISION: `
        INSERT INTO document_revision
        (
            document_id,
            revision_no,
            effective_from,
            effective_to,
            change_description,
            approved_by,
            status
        )
        VALUES
        (
            $1,$2,$3,$4,$5,$6,$7
        )
        RETURNING *;
    `,

    INSERT_DOCUMENT_ACCESS: `
        INSERT INTO document_access_config
        (
            document_id,
            role_name,
            can_view,
            can_download,
            can_print,
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

            dm.document_id,

            dm.document_no,

            dm.document_name,

            dr.revision_no,

            dvl.view_log_id,

            dvl.viewed_by,

            dvl.viewed_from,

            dvl.remarks,

            dvl.event_ts

        FROM document_master dm

        LEFT JOIN document_revision dr
            ON dm.document_id = dr.document_id

        LEFT JOIN document_view_log dvl
            ON dm.document_id = dvl.document_id

        ORDER BY

            dvl.event_ts DESC NULLS LAST;
    `,

    INSERT_DOCUMENT_VIEW_LOG: `
        INSERT INTO document_view_log
        (
            document_id,
            viewed_by,
            viewed_from,
            remarks
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

            dm.document_id,

            dm.document_no,

            dm.document_name,

            dm.document_type,

            dm.department,

            dr.revision_no,

            dr.effective_from,

            dac.role_name,

            dac.can_view,

            dac.can_download,

            dvl.viewed_by,

            dvl.event_ts,

            dm.status

        FROM document_master dm

        LEFT JOIN document_revision dr
            ON dm.document_id = dr.document_id

        LEFT JOIN document_access_config dac
            ON dm.document_id = dac.document_id

        LEFT JOIN document_view_log dvl
            ON dm.document_id = dvl.document_id

        WHERE

            ($1::varchar IS NULL OR dm.status = $1)

        ORDER BY

            dm.document_no;
    `

};