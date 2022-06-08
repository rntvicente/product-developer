const BearerStrategy = require("passport-http-bearer").Strategy;

const service = require("../user/services");

const bearer = new BearerStrategy(async (token, cb) => {
  const user = await service.findUserByToken(token);

  if (!user || !token) {
    return cb(null, false);
  }

  return cb(null, user, { scope: "all" });
});

module.exports = bearer;
