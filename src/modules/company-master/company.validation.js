function validateCompany(payload) {
    const errors = [];

    if (!payload.company_code)
        errors.push("company_code required");

    if (!payload.company_name)
        errors.push("company_name required");

    if (!payload.timezone)
        errors.push("timezone required");

    return errors;
}

module.exports = { validateCompany };