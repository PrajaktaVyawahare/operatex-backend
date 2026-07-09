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

module.exports = {
    login
};