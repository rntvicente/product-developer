const app = require("express");
const passport = require("passport");

const levelsRoutes = require("../levels");

module.exports = () => {
  const router = app.Router();
  router.use(passport.authenticate("bearer", { session: false }));

  levelsRoutes(router);

  return router;
};
