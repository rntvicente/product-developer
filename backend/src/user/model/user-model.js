const database = require("../../database");

const COLLECTION_NAME = "users";

const create = async (user) => {
  const data = {
    ...user,
    createAt: new Date(),
  };

  await database.getCollection(COLLECTION_NAME).insertOne(data);
};

const findBy = async (filter, options = {}) => {
  const users = await database
    .getCollection(COLLECTION_NAME)
    .find(filter, options)
    .toArray();

  return users;
};

module.exports = { create, findBy };
