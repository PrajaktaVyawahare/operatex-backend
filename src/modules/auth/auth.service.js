const repo = require("./auth.repository");
const jwt = require("jsonwebtoken");

async function login(username, password, req) {
console.log("Username:", username);
    const user = await repo.getUserByUsername(username);

    if (!user) {
        throw new Error("User not found");
    }

    if (user.password !== password) {
        throw new Error("Invalid password");
    }
    const activeSession =
    await repo.getActiveSession(user.user_id);

if (activeSession) {
    throw new Error(
        "User is already logged in on another system. Please logout first."
    );
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

        token,
           user: {
        user_id: user.user_id,
        username: user.username,
        role_name: user.role_name
    }
        

    };

}
async function logout(sessionId) {

    await repo.logout(sessionId);

}

module.exports = {

    login,
     logout

};