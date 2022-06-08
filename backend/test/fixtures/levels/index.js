const { ObjectId } = require("mongodb");

const model = require("../../../src/levels/model");

const populate = (level) => model.create(level);

module.exports = { populate };
