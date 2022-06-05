const service = require("../services");

const create = async (req, res) => {
  const {
    body: { level },
  } = req;

  try {
    res.status(201).end();
    await service.create(level);
  } catch (error) {
    console.error(
      "[ERROR] Controller | create | Level: %s | %o",
      level,
      error.stack
    );
  }
};

module.exports = { create };
