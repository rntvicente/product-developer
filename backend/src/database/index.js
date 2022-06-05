const { MongoClient } = require('mongodb');

const conf = require('../config');

const database = (() => {
  const databaseUri = conf.get('DATABASE_URI');
  const databaseName = conf.get('DATABASE_NAME');

  let db;
  let client;
  let collections = [];

  const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
  };

  const connect = async () => {
    if (!db) {
      client = await MongoClient.connect(databaseUri, options);
      db = client.db(databaseName);
    }

    console.info('[MongoDB] Database connected.');

    return db;
  };

  const close = async () => {
    console.info('[MongoDB] Database trying to disconnect');

    if (client) {
      try {
        await client.close();
      } finally {
        db = null;
        client = null;
        collections = [];
        console.info('[MongoDB] Database disconnected');
      }

      return client;
    }

    return 'No client connection found to close';
  };

  const getCollection = (name) => {
    if (db) {
      let collection = collections[name];

      if (!collection) {
        collection = db.collection(name);
        collections[name] = collection;
      }

      return collection;
    }

    return null;
  };

  return {
    connect,
    close,
    getCollection
  };
})();

module.exports = database;
