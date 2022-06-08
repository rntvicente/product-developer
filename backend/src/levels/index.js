const validate = require("./validator");
const { create, getAll } = require("./controller");

const router = (router) => {
  router.post("/levels", validate, create);
  router.get("/levels", getAll);
};

module.exports = router;
