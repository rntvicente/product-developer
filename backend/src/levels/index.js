const validate = require("./validator");
const { create, getAll, findById } = require("./controller");

const router = (router) => {
  router.post("/levels", validate, create);
  router.get("/levels", getAll);
  router.get("/levels/:id", findById);
};

module.exports = router;
