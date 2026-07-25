// ======================================================
// DEVICE MASTER
// ======================================================

const GET_MASTER = `
SELECT *
FROM device_master
ORDER BY device_id DESC;
`;

const CREATE_MASTER = `
INSERT INTO device_master
(
    machine_id,
    device_type,
    protocol,
    ip,
    port,
    slave_id,
    status,
    created_at,
    updated_at
)
VALUES
(
    $1,$2,$3,$4,$5,$6,$7,NOW(),NOW()
)
RETURNING *;
`;

const UPDATE_MASTER = `
UPDATE device_master
SET
    machine_id=$1,
    device_type=$2,
    protocol=$3,
    ip=$4,
    port=$5,
    slave_id=$6,
    status=$7,
    updated_at=NOW()
WHERE device_id=$8
RETURNING *;
`;


// ======================================================
// PROTOCOL CONFIG
// ======================================================

const GET_PROTOCOL_CONFIG = `
SELECT *
FROM protocol_config
ORDER BY protocol_id;
`;

const CREATE_PROTOCOL_CONFIG = `
INSERT INTO protocol_config
(
    protocol_name,
    timeout,
    retry,
    polling_ms,
    read_function_code,
    write_function_code,
    packet_size,
    connection_type,
    description,
    status,
    created_at,
    updated_at
)
VALUES
(
    $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW(),NOW()
)
RETURNING *;
`;


// ======================================================
// GATEWAY CONFIG
// ======================================================

const GET_GATEWAY_CONFIG = `
SELECT *
FROM gateway_config
ORDER BY gateway_id;
`;

const CREATE_GATEWAY_CONFIG = `
INSERT INTO gateway_config
(
    company_id,
    gateway_name,
    gateway_code,
    gateway_type,
    broker_url,
    broker_port,
    username,
    password,
    site,
    location,
    heartbeat_interval,
    reconnect_interval,
    gateway_version,
    status,
    created_at,
    updated_at
)
VALUES
(
    $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,NOW(),NOW()
)
RETURNING *;
`;


// ======================================================
// RUNTIME
// ======================================================

const GET_RUNTIME = `
SELECT *
FROM device_health_event
ORDER BY created_at DESC;
`;


// ======================================================
// EXECUTE
// ======================================================

const EXECUTE_ACTION = `
INSERT INTO device_health_event
(
    device_id,
    event_type,
    event_status,
    created_at
)
VALUES
(
    $1,
    'MANUAL_EXECUTE',
    'SUCCESS',
    NOW()
)
RETURNING *;
`;


// ======================================================
// REPORT
// ======================================================

const GET_REPORT = `
SELECT *
FROM device_master
ORDER BY created_at DESC;
`;


// ======================================================
// EXPORT
// ======================================================

const EXPORT_DATA = `
SELECT *
FROM device_master
ORDER BY device_id;
`;

// ======================================================
// GET MASTER BY ID
// ======================================================

const GET_MASTER_BY_ID = `
SELECT *
FROM device_master
WHERE device_id = $1
AND status = 'ACTIVE';
`;

// ======================================================
// DELETE MASTER
// ======================================================

const DELETE_MASTER = `
UPDATE device_master
SET
    status = 'INACTIVE',
    updated_at = NOW()
WHERE device_id = $1
AND status = 'ACTIVE'
RETURNING *;
`;

// ======================================================
// DELETE MULTIPLE MASTER
// ======================================================

const DELETE_MULTIPLE_MASTER = `
UPDATE device_master
SET
    status = 'INACTIVE',
    updated_at = NOW()
WHERE device_id = ANY($1::int[])
AND status = 'ACTIVE'
RETURNING *;
`;



module.exports = {

    GET_MASTER,

    CREATE_MASTER,

    UPDATE_MASTER,

    GET_PROTOCOL_CONFIG,

    CREATE_PROTOCOL_CONFIG,

    GET_GATEWAY_CONFIG,

    CREATE_GATEWAY_CONFIG,

    GET_RUNTIME,

    EXECUTE_ACTION,

    GET_REPORT,

    GET_MASTER_BY_ID,

    DELETE_MASTER,
    
    DELETE_MULTIPLE_MASTER,

    EXPORT_DATA

};