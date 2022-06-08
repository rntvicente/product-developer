const { create } = require("./create-levels-controller");
const { getAll } = require("./get-all-levels-controller");
const { findById } = require("./find-by-id-levels-controller");
const { findOneAndUpdate } = require("./find-one-update-levels-controller");
const { findOneAndDelete } = require("./find-one-delete-levels-controller");

module.exports = {
  create,
  getAll,
  findById,
  findOneAndUpdate,
  findOneAndDelete
};
