const sinon = require("sinon");
const { assert } = require("chai");
const bcryptjs = require("bcryptjs");

const service = require("../../../src/user/services");
const model = require("../../../src/user/model");

describe("# Unit Test Create User", () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  it("Deve receber error quando Banco de Dados não responder", async () => {
    sandbox.stub(bcryptjs, "hashSync").returns("encrypt");
    const createStub = sandbox
      .stub(model, "create")
      .rejects("Internal Server Error");

    try {
      await service.create("valid_name", "valid_password");
      assert.fail("Deve lançar um Error()");
    } catch (error) {
      assert.isOk(error);
      sandbox.assert.calledWithExactly(createStub, {
        user: "valid_name",
        token: "encrypt",
      });
    }
  });

  it("Deve lançar erro quando não informado campo user", async () => {
    try {
      await service.create();
      assert.fail("Deve lançar um Error()");
    } catch (error) {
      assert.isOk(error);
      assert.strictEqual(error.message, "Missing params: user");
    }
  });

  it("Deve lançar erro quando não informado campo password", async () => {
    try {
      await service.create("valid_user");
      assert.fail("Deve lançar um Error()");
    } catch (error) {
      assert.isOk(error);
      assert.strictEqual(error.message, "Missing params: password");
    }
  });

  it("Deve chamar model correramente", async () => {
    const dateFaker = new Date(2000, 1, 1);

    sandbox.stub(bcryptjs, "hashSync").returns("encrypt");
    sandbox.useFakeTimers(dateFaker);
    const createSpy = sandbox
      .stub(model, "create")
      .callsFake(() => Promise.resolve({}));

    await service.create("valid_name", "valid_password");

    sandbox.assert.calledOnceWithExactly(createSpy, {
      user: 'valid_name',
      token: 'encrypt'
    });
  });
});
