const config = require("../../src/config");

const mongo = (() => {
  let db;
  let database;

  const createDatabase = async () => {
    config.set("DATABASE_NAME", `${config.get("DATABASE_NAME")}_test`);

    database = require("../../src/database");

    db = await database.connect();
    return db;
  };

  const dropDatabase = async () => {
    await db.dropDatabase();
    await database.close();
  };

  const clearCollection = async (name) => {
    await db.collection(name).deleteMany({});
  };

  const getCollection = async (name) => {
    return db.collection(name);
  };

  return {
    createDatabase,
    dropDatabase,
    clearCollection,
    getCollection
  };
})();

module.exports = mongo;
