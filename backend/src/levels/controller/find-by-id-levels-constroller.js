const service = require("../services");

const findById = async (req, res) => {
  const { id } = req.params;

  try {
    const level = await service.findById(id);

    if (!level) {
      res.status(404).end();
      return;
    }

    res.status(200).json(level);
  } catch (error) {
    console.error(`[ERROR] Controller | findById | ${id}`);
    res.status(500).end();
  }
};

module.exports = { findById };
