const sinon = require("sinon");
const request = require("supertest");
const { assert } = require("chai");

const fixture = require("../../fixtures");
const database = require("../../database");
const server = require("../../../src/server");
const model = require("../../../src/levels/model");

let app;

describe("# Integration Test GetAll Level", () => {
  const sandbox = sinon.createSandbox();

  before(async () => {
    await database.createDatabase();
    app = await server.start();
  });

  beforeEach(async () => {
    const levels = ["junior", "pleno", "senior"];

    for (let index = 0; index < levels.length; index++) {
      fixture.levels.populate(levels[index]);
    }
  });

  afterEach(async () => {
    sandbox.restore();
    await database.clearCollection("levels");
  });

  after(async () => {
    await server.stop();
    await database.dropDatabase();
  });

  it("Deve receber 500 quando Banco de Dados falhar", async () => {
    const getAllStub = sandbox
      .stub(model, "getAll")
      .rejects("Internal Server Error");

    await request(app).get("/levels").expect(500);

    sandbox.assert.calledOnce(getAllStub);
  });

  it("Deve retornar status 204 quando não ter registros", async () => {
    const createStub = sandbox.stub(model, "getAll").returns([]);
    await request(app).get("/levels").expect(204);

    sandbox.assert.calledOnce(createStub);
  });

  it("Deve retornar status 200 e body contendo array", async () => {
    const getAllStub = sandbox.stub(model, "getAll").returns([{}]);

    const { status, body } = await request(app).get("/levels");

    assert.isArray(body);
    assert.strictEqual(status, 200);
    sandbox.assert.calledOnce(getAllStub);
  });

  it("Deve retornar array com 3 elementos", async () => {
    const { body } = await request(app).get("/levels");

    assert.strictEqual(body.length, 3);
  });

  it("Deve retornar array com 3 elementos experados", async () => {
    const date = new Date(2000, 1, 1);
    sandbox.useFakeTimers(date);

    const { body } = await request(app).get("/levels");

    assert.isTrue(body.some((item) => item.level === "junior"));
    assert.isTrue(body.some((item) => item.level === "pleno"));
    assert.isTrue(body.some((item) => item.level === "senior"));
  });
});
