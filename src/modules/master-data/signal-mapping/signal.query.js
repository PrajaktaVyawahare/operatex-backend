// ======================================================
// GET CONFIGURATION
// ======================================================

// ======================================================
// GET PROTOCOL CONFIG
// ======================================================

const GET_PROTOCOL_CONFIG = `
SELECT *
FROM protocol_config
WHERE status = 'ACTIVE'
ORDER BY protocol_id;
`;
// ======================================================
// GET GATEWAY CONFIG
// ======================================================

const GET_GATEWAY_CONFIG = `
SELECT *
FROM gateway_config
WHERE status = 'ACTIVE'
ORDER BY gateway_id;
`;
// ======================================================
// UPDATE CONFIGURATION
// ======================================================

// ======================================================
// UPDATE PROTOCOL CONFIG
// ======================================================

const UPDATE_PROTOCOL_CONFIG = `
UPDATE protocol_config
SET
    protocol_name = $1,
    timeout = $2,
    retry = $3,
    polling_ms = $4,
    read_function_code = $5,
    write_function_code = $6,
    packet_size = $7,
    connection_type = $8,
    description = $9,
    status = $10,
    updated_at = NOW()
WHERE protocol_id = $11
RETURNING *;
`;

// ======================================================
// UPDATE GATEWAY CONFIG
// ======================================================

const UPDATE_GATEWAY_CONFIG = `
UPDATE gateway_config
SET
    gateway_name = $1,
    gateway_code = $2,
    gateway_type = $3,
    broker_url = $4,
    broker_port = $5,
    username = $6,
    password = $7,
    site = $8,
    location = $9,
    heartbeat_interval = $10,
    reconnect_interval = $11,
    gateway_version = $12,
    status = $13,
    updated_at = NOW()
WHERE gateway_id = $14
RETURNING *;
`;
// ======================================================
// GET MASTER
// ======================================================

const GET_MASTER = `
SELECT *
FROM machine_signal_mapping
WHERE status = 'ACTIVE'
ORDER BY mapping_id DESC;
`;
// ======================================================
// GET MASTER BY ID
// ======================================================

const GET_MASTER_BY_ID = `
SELECT *
FROM machine_signal_mapping
WHERE mapping_id = $1
AND status = 'ACTIVE';
`;
// ======================================================
// CREATE MASTER
// ======================================================

const CREATE_MASTER = `
INSERT INTO machine_signal_mapping
(
    machine_id,
    signal_name,
    tag_name,
    protocol,
    address,
    data_type,
    access_type,
    scaling_factor,
    unit,
    status,
    created_at,
    updated_at
)
VALUES
(
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8,
    $9,
    $10,
    NOW(),
    NOW()
)
RETURNING *;
`;


// ======================================================
// UPDATE MASTER
// ======================================================

const UPDATE_MASTER = `
UPDATE machine_signal_mapping
SET
    machine_id = $1,
    signal_name = $2,
    tag_name = $3,
    protocol = $4,
    address = $5,
    data_type = $6,
    access_type = $7,
    scaling_factor = $8,
    unit = $9,
    status = $10,
    updated_at = NOW()
WHERE mapping_id = $11
RETURNING *;
`;
// ======================================================
// DELETE MASTER
// ======================================================

const DELETE_MASTER = `
UPDATE machine_signal_mapping
SET
    status = 'INACTIVE',
    updated_at = NOW()
WHERE mapping_id = $1
AND status = 'ACTIVE'
RETURNING *;
`;
// ======================================================
// DELETE MULTIPLE MASTER
// ======================================================

const DELETE_MULTIPLE_MASTER = `
UPDATE machine_signal_mapping
SET
    status = 'INACTIVE',
    updated_at = NOW()
WHERE mapping_id = ANY($1::int[])
AND status = 'ACTIVE'
RETURNING *;
`;

// ======================================================
// GET RUNTIME
// ======================================================

const GET_RUNTIME = `
SELECT *
FROM raw_signal_event
ORDER BY received_at DESC;
`;


// ======================================================
// EXECUTE ACTION
// ======================================================

const EXECUTE_ACTION = `
INSERT INTO raw_signal_event
(
    mapping_id,
    raw_value,
    gateway_name,
    protocol,
    quality,
    status
)
VALUES
(
    $1,
    $2,
    $3,
    $4,
    $5,
    'SUCCESS'
)
RETURNING *;
`;


// ======================================================
// GET REPORT
// ======================================================

const GET_REPORT = `
SELECT *
FROM normalized_signal_event
ORDER BY processed_at DESC;
`;


// ======================================================
// EXPORT DATA
// ======================================================

const EXPORT_DATA = `
SELECT *
FROM normalized_signal_event
ORDER BY normalized_event_id;
`;


module.exports = {

    GET_PROTOCOL_CONFIG,
    UPDATE_PROTOCOL_CONFIG,

    GET_GATEWAY_CONFIG,
    UPDATE_GATEWAY_CONFIG,

    GET_MASTER,
    GET_MASTER_BY_ID,
    CREATE_MASTER,
    UPDATE_MASTER,
    DELETE_MASTER,
    DELETE_MULTIPLE_MASTER,
    GET_RUNTIME,
    EXECUTE_ACTION,
    GET_REPORT,
    EXPORT_DATA

};