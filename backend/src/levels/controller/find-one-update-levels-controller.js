const service = require("../services");

const findOneAndUpdate = async (req, res) => {
  const { id } = req.params;
  const { body: { level } } = req;

  try {
    const result = await service.findOneAndUpdate(id, level);

    if (!result) {
      res.status(204).end();
      return;
    }

    res.status(200).end();
  } catch (error) {
    console.error(`[ERROR] Controller | findOneAndUpdate | ${id}`);
    res.status(500).end();
  }
};

module.exports = { findOneAndUpdate };
