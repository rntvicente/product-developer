const { ObjectId } = require("mongodb");

const model = require("../model");

const findOneAndUpdate = async (id, level) => {
  const _id = ObjectId(id);
  const set = {
    $set: { level, updateAt: new Date() }
  };

  return await model.findOneAndUpdate({ _id }, set);
};

module.exports = { findOneAndUpdate };
