const validate = require("./validator");
const {
  create,
  getAll,
  findById,
  findOneAndUpdate,
  findOneAndDelete,
} = require("./controller");

const router = (router) => {
  router.post("/levels", validate, create);
  router.put("/levels/:id", validate, findOneAndUpdate);
  router.delete("/levels/:id", findOneAndDelete);
  router.get("/levels", getAll);
  router.get("/levels/:id", findById);
};

module.exports = router;
