const repo = require("./auth.repository");
const jwt = require("jsonwebtoken");

async function login(username, password, req) {

    const user = await repo.getUserByUsername(username);

    if (!user) {
        throw new Error("User not found");
    }

    if (user.password !== password) {
        throw new Error("Invalid password");
    }

    // Generate JWT first
    const token = jwt.sign(
        {
            user_id: user.user_id,
            role_id: user.role_id,
            role_name: user.role_name
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "30d"
        }
    );

    // Store login history
    await repo.createLoginLog({

        user_id: user.user_id,

        login_status: "SUCCESS",

        login_ip: req.ip,

        device_name: req.headers["user-agent"],

        session_id: token

    });

    return {

        token

    };

}

module.exports = {

    login

};