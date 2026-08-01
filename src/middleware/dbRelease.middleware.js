function dbRelease(req, res, next) {

    res.on("finish", () => {

        if (req.db) {

            req.db.release();

        }

    });

    next();

}

module.exports = { dbRelease };