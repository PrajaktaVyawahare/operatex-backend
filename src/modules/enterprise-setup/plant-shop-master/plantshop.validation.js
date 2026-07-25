function validateMaster(payload) {
    const errors = [];

    if (!payload.type) {
        errors.push("type required");
        return errors;
    }

    if (
        !["PLANT", "SHOP"].includes(
            payload.type
        )
    ) {
        errors.push("Invalid type");
    }

    if (payload.type === "PLANT") {
        if (!payload.company_id)
            errors.push("company_id required");

        if (!payload.plant_code)
            errors.push("plant_code required");

        if (!payload.plant_name)
            errors.push("plant_name required");

        if (!payload.plant_type)
            errors.push("plant_type required");
    }

    if (payload.type === "SHOP") {
        if (!payload.plant_id)
            errors.push("plant_id required");

        if (!payload.shop_code)
            errors.push("shop_code required");

        if (!payload.shop_name)
            errors.push("shop_name required");
    }

    const allowedStatus = [
        "ACTIVE",
        "INACTIVE",
        "SUSPENDED"
    ];

    if (
        payload.status &&
        !allowedStatus.includes(payload.status)
    ) {
        errors.push("Invalid status");
    }

    return errors;
}

module.exports = {
    validateMaster
};