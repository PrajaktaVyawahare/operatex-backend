// ==========================================================
// MODULE MASTER
// ==========================================================

const GET_MASTER = `

SELECT

    module_config_id,

    module_name,

    display_name,

    module_group,

    route_url,

    icon,

    description,

    display_order,

    status,

    created_at,

    updated_at

FROM module_config

ORDER BY display_order;

`;

const CREATE_MASTER = `

INSERT INTO module_config
(
    module_name,
    display_name,
    module_group,
    route_url,
    icon,
    description,
    display_order,
    status
)
VALUES
(
    $1,$2,$3,$4,$5,$6,$7,$8
)
RETURNING *;

`;


// Dynamic Update

const UPDATE_MASTER = (fields, values) => `

UPDATE module_config

SET

${fields.map((field, index) =>
`${field} = $${index + 1}`).join(",")},

updated_at = CURRENT_TIMESTAMP

WHERE module_config_id = $${values.length}

RETURNING *;

`;


// ==========================================================
// CONFIG
// ==========================================================

const GET_CONFIG = `

SELECT

    ml.license_id,

    ml.tenant_id,

    ml.module_name,

    mc.display_name,

    mc.module_group,

    ml.is_enabled,

    ml.module_version,

    ml.license_key,

    ml.user_limit,

    ml.api_limit,

    ml.valid_from,

    ml.valid_to

FROM module_license_config ml

LEFT JOIN module_config mc

ON mc.module_name = ml.module_name



ORDER BY mc.display_order;

`;


// ==========================================================
// UPDATE MODULE ENABLE / DISABLE
// ==========================================================

const UPDATE_MODULE_LICENSE = `

UPDATE module_license_config

SET

    is_enabled = $1,

    updated_at = CURRENT_TIMESTAMP

WHERE

    module_name = $2

RETURNING *;

`;


// ==========================================================
// FEATURE FLAGS
// ==========================================================

const GET_FEATURE_FLAGS = `

SELECT

    feature_id,

    module_name,

    feature_code,

    feature_name,

    is_enabled,

    description

FROM feature_flag_config

ORDER BY module_name,
feature_name;

`;

const UPDATE_FEATURE_FLAG = `

UPDATE feature_flag_config

SET

    is_enabled = $1,

    updated_at = CURRENT_TIMESTAMP

WHERE

    feature_id = $2

RETURNING *;

`;


// ==========================================================
// RUNTIME
// ==========================================================

const GET_RUNTIME = `

SELECT

    ml.module_name,
    mc.display_name,
    ml.is_enabled,
    ml.updated_at

FROM module_license_config ml

LEFT JOIN module_config mc
ON mc.module_name = ml.module_name

ORDER BY mc.display_name;

`;


// ==========================================================
// REPORT
// ==========================================================

const GET_REPORT = `

SELECT

    mc.module_name,
    mc.display_name,
    mc.module_group,
    ml.is_enabled,
    ml.user_limit,
    ml.api_limit,
    ml.valid_from,
    ml.valid_to

FROM module_config mc

LEFT JOIN module_license_config ml
ON mc.module_name = ml.module_name

ORDER BY mc.display_order;

`;

// ==========================================================
// EXPORTS
// ==========================================================

module.exports = {

    GET_MASTER,

    CREATE_MASTER,

    UPDATE_MASTER,

    GET_CONFIG,

    UPDATE_MODULE_LICENSE,

    GET_FEATURE_FLAGS,

    UPDATE_FEATURE_FLAG,

    GET_RUNTIME,

    GET_REPORT

};