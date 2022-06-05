const jwt = require('jsonwebtoken');

const config = require('../config');

const middleware = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    next();
  }

  const token = req.body.token || req.query.token || req.headers['authorization'];

  if (!token) {
    return res.status(403).send({
      errors: ['No token provided']
    });
  }

  jwt.verify(token, config.get("SECRET"), (err) => {
    if (err) {
      return res.status(403).send({ errors: ['Failed to autheticate token.'] })
    }

    next();
  });
};

module.exports = middleware;
