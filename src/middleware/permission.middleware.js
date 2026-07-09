function checkPermission(permission) {
    return (req, res, next) => {
        if (req.user.role_name === "ADMIN") {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "Permission denied"
        });
    };
}

module.exports = { checkPermission };