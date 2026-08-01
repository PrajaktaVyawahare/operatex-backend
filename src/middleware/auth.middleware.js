const jwt = require("jsonwebtoken");

function verifyJWT(req, res, next) {

    try {

        const authHeader =
            req.headers.authorization;

        if (!authHeader) {

            return res.status(401).json({

                success:false,

                message:"Token missing"

            });

        }

        const token =
            authHeader.split(" ")[1];

        const decoded =
            jwt.verify(

                token,

                process.env.JWT_SECRET

            );

        req.user = decoded;
        global.currentUserId = decoded.user_id;

        next();

    }

    catch(err){

        return res.status(401).json({

            success:false,

            message:"Invalid token"

        });

    }

}

module.exports = { verifyJWT };