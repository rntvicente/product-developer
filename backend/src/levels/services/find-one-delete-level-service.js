const { ObjectId } = require("mongodb");

const model = require("../model");

const findOneAndDelete = async (id, level) => {
  const _id = ObjectId(id);

  return await model.findOneAndDelete({ _id });
};

module.exports = { findOneAndDelete };
