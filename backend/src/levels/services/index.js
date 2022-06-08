const { create } = require("./create-level-service");
const { getAll } = require("./get-all-level-service");
const { findById } = require("./find-by-id-level-service");
const { findOneAndUpdate } = require("./find-one-update-level-service");
const { findOneAndDelete } = require("./find-one-delete-level-service");

module.exports = {
  create,
  getAll,
  findById,
  findOneAndUpdate,
  findOneAndDelete,
};
