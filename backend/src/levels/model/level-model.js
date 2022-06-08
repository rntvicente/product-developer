const database = require("../../database");

const COLLECTION_NAME = "levels";

const create = async (level) => {
  const data = {
    level,
    createAt: new Date(),
  };

  return await database.getCollection(COLLECTION_NAME).insertOne(data);
};

const getAll = async () => {
  const levels = await database.getCollection(COLLECTION_NAME).find().toArray();
  return levels;
};

const findById = async (filter, options = {}) => {
  const level = await database
    .getCollection(COLLECTION_NAME)
    .findOne(filter, options);

  return level;
};

const findOneAndUpdate = async (filter, set, options = {}) => {
  const level = await database
    .getCollection(COLLECTION_NAME)
    .updateOne(filter, { $set: set }, options);
  return level;
};

const findOneAndDelete = async (filter, options = {}) => {
  await database.getCollection(COLLECTION_NAME).deleteOne(filter, options);
};

module.exports = {
  create,
  getAll,
  findById,
  findOneAndUpdate,
  findOneAndDelete,
};
