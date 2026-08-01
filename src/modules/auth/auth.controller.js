const service = require("./auth.service");

async function login(req, res, next) {

    try {

        const result = await service.login(
            req.body.username,
            req.body.password,
            req
        );

        res.json({
            success: true,
            message: "Login successful",
            data: result
        });

    } catch (err) {
        next(err);
    }

}
async function logout(req, res, next) {

    try {

        const token =
            req.headers.authorization.split(" ")[1];

        await service.logout(token);

        res.json({
            success: true,
            message: "Logout successful"
        });

    } catch (err) {
        next(err);
    }

}

module.exports = {
    login,
      logout
};