const service = require("../services");

const getAll = async (req, res) => {
  try {
    const levels = await service.getAll();

    if (levels.length <= 0) {
      res.status(204).end();
      return;
    }

    res.status(200).json(levels);
  } catch (error) {
    console.error("[ERROR] Controller | getAll");
    res.status(500).end();
  }
};

module.exports = { getAll };
