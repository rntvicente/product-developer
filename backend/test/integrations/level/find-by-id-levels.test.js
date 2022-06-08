const sinon = require("sinon");
const request = require("supertest");
const { assert } = require("chai");

const fixture = require("../../fixtures");
const database = require("../../database");
const server = require("../../../src/server");
const model = require("../../../src/levels/model");
const userService = require("../../../src/user/services");

let app;

describe("# Integration Test FindById Level", () => {
  const sandbox = sinon.createSandbox();
  const token = "password";
  const dateFaker = new Date(2000, 1, 1);
  let idEstagiario;

  before(async () => {
    await database.createDatabase();
    app = await server.start();
    await userService.create("valid_name", token);
  });

  beforeEach(async () => {
    sandbox.useFakeTimers(dateFaker);
    const { insertedId } = await fixture.levels.populate("estagiário");

    idEstagiario = insertedId.toString();
  });

  afterEach(async () => {
    sandbox.restore();
    await database.clearCollection("levels");
  });

  after(async () => {
    await database.clearCollection("users");
    await database.dropDatabase();
    await server.stop();
  });

  it("Deve retornar 401 quando não encontrado user", async () => {
    await request(app)
      .get(`/levels/${idEstagiario}`)
      .set("Authorization", "bearer invalid_Token")
      .expect(401);
  });

  it("Deve retornar 401 quando não informado token", async () => {
    await request(app)
      .get(`/levels/${idEstagiario}`)
      .send({ level: "valid" })
      .expect(401);
  });

  it("Deve receber 500 quando Banco de Dados falhar", async () => {
    const findByIdStub = sandbox.stub(model, "findById").callsFake((arg1) => {
      throw new Error("Internal Server Error");
    });

    await request(app)
      .get(`/levels/${idEstagiario}`)
      .set("Authorization", `bearer ${token}`)
      .expect(500);

    sandbox.assert.calledOnce(findByIdStub);
  });

  it("Deve retornar status 404 quando não encontrado ID", async () => {
    const findByIdSpy = sandbox.spy(model, "findById");

    await request(app)
      .get("/levels/62a01484b7dbbbc7796ed371")
      .set("Authorization", `bearer ${token}`)
      .expect(404);

    sandbox.assert.calledOnce(findByIdSpy);
  });

  it("Deve retornar Estagiário corretamente", async () => {
    const { status, body } = await request(app)
      .get(`/levels/${idEstagiario}`)
      .set("Authorization", `bearer ${token}`);

    assert.strictEqual(status, 200);
    assert.deepEqual(body, {
      _id: idEstagiario,
      level: "estagiário",
      createAt: dateFaker.toISOString(),
    });
  });
});
