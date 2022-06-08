const { ObjectId } = require("mongodb");

const model = require("../model");

const findById = async (id) => {
  const _id = ObjectId(id);

  const level = await model.findById({ _id });

  return level;
};

module.exports = { findById };
