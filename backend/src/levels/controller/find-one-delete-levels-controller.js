const service = require("../services");

const findOneAndDelete = async (req, res) => {
  const { id } = req.params;
  const { body: { level } } = req;

  try {
    const result = await service.findOneAndDelete(id, level);

    if (!result) {
      res.status(204).end();
      return;
    }

    res.status(202).end();
  } catch (error) {
    console.error(`[ERROR] Controller | findOneAndDelete | ${id}`);
    res.status(500).end();
  }
};

module.exports = { findOneAndDelete };
