const bcryptjs = require("bcryptjs");

const model = require("../model");

const salt = bcryptjs.genSaltSync(12);

const encrypter = (password) => bcryptjs.hashSync(password, salt);

const compare = (password, token) => bcryptjs.compareSync(password, token);

const create = async (user, password) => {
  if (!user) {
    throw new Error("Missing params: user");
  }

  if (!password) {
    throw new Error("Missing params: password");
  }

  const token = encrypter(password);

  await model.create({ user, token });
};

const findUserByToken = async (token) => {
  if (!token) {
    throw new Error("Missing param: token");
  }

  const hash = encrypter(token);

  const [user] = await model.findBy({ token: hash });

  if (!user) {
    return false;
  }

  const validToken = compare(token, user.token);

  return validToken;
};

module.exports = { create, findUserByToken };
