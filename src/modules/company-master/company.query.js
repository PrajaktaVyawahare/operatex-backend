module.exports = {
    COUNT: `
        SELECT COUNT(*)
        FROM company_master
    `,

    CREATE: `
        INSERT INTO company_master
        (
            company_code,
            company_name,
            timezone,
            status
        )
        VALUES ($1,$2,$3,$4)
        RETURNING *
    `,
    GET_CONFIG: `
        SELECT * FROM company_master
        LIMIT 1

`,
GET_MASTER: `
    SELECT *
    FROM company_master
    ORDER BY company_id DESC
`,

UPDATE_MASTER: `
    UPDATE company_master
    SET
        company_code=$2,
        company_name=$3,
        timezone=$4,
        status=$5
    WHERE company_id=$1
    RETURNING *
`,

GET_RUNTIME: `
    SELECT *
    FROM audit_log
    ORDER BY created_at DESC
`,

GET_REPORT: `
    SELECT *
    FROM company_master
`,

GET_BY_ID: `
    SELECT *
    FROM company_master
    WHERE company_id=$1
`
};