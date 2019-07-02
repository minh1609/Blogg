const { clearHash } = require("../services/cache");

//Middleware will le
//this middleware will run if request is complete
module.exports = async (req, res, next) => {
    await next();
    clearHash(req.user.id);
};
