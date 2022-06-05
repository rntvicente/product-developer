const schema = require("./schemas/level-schema");

const middleware = (req, res, next) => {
  const { body } = req;

  const { error } = schema.validate(body);
  const valid = error === undefined;

  if (valid) {
    next();
  } else {
    const message = error?.details.map((i) => i.message).join(",");

    console.error("error", message);
    res.status(422).json({ error: message });
  }
};

module.exports = middleware;
