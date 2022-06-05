const app = require("express");

const validate = require("./validator");
const { create, getAll } = require("./controller");

const router = app.Router();

router.post("/levels", validate, create);
router.get("/levels", getAll);

module.exports = router;
