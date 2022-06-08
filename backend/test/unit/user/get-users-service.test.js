const sinon = require("sinon");
const { assert } = require("chai");
const bcryptjs = require("bcryptjs");

const service = require("../../../src/user/services");
const model = require("../../../src/user/model");

describe("# Unit Test Get Users", () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  it("Deve receber error quando Banco de Dados não responder", async () => {
    const token = "secret";
    const bcryptjsStub = sandbox.stub(bcryptjs, "hashSync").returns(token);
    const findByStub = sandbox
      .stub(model, "findBy")
      .rejects("Internal Server Error");

    try {
      await service.findUserByToken(token);
      assert.fail("Deve lançar um Error()");
    } catch (error) {
      assert.isOk(error);
      sandbox.assert.calledOnce(bcryptjsStub);
      sandbox.assert.calledWithExactly(findByStub, { token });
    }
  });

  it("Deve lançar erro quando não informado token", async () => {
    const bcryptSpy = sandbox.spy(bcryptjs, "hashSync");
    const findBySpy = sandbox.spy(model, "findBy");

    try {
      await service.findUserByToken();
      assert.fail("Deve lançar um Error()");
    } catch (error) {
      assert.isOk(error);
      sandbox.assert.notCalled(bcryptSpy);
      sandbox.assert.notCalled(findBySpy);
    }
  });

  it("Deve retornar false quando comparação de senhas falhar", async () => {
    const compareSyncStub = sandbox.stub(bcryptjs, "compareSync").returns(false);
    sandbox.stub(bcryptjs, "hashSync").returns("hash");

    const findByStub = sandbox.stub(model, "findBy").callsFake(() => ([{
      _id: "valid_id",
      user: "valid_name",
      token: "hash",
      create: new Date(2000, 1, 1),
    }]));

    const result = await service.findUserByToken("secret");

    assert.isFalse(result);
    sandbox.assert.alwaysCalledWithExactly(compareSyncStub, "secret", "hash");
    sandbox.assert.alwaysCalledWithExactly(findByStub, { token: "hash" });
  });

  it("Deve retornar true quando comparação de senhas falhar", async () => {
    const compareSyncStub = sandbox.stub(bcryptjs, "compareSync").returns(true);
    sandbox.stub(bcryptjs, "hashSync").returns("hash");

    const findByStub = sandbox.stub(model, "findBy").callsFake(() => ([{
      _id: "valid_id",
      user: "valid_name",
      token: "hash",
      create: new Date(2000, 1, 1),
    }]));

    const result = await service.findUserByToken("secret");

    assert.isTrue(result);
    sandbox.assert.alwaysCalledWithExactly(compareSyncStub, "secret", "hash");
    sandbox.assert.alwaysCalledWithExactly(findByStub, { token: "hash" });
  });
});
