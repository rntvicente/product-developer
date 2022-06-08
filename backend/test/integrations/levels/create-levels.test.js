const request = require("supertest");
const sinon = require("sinon");
const { assert } = require("chai");

const database = require("../../database");
const server = require("../../../src/server");
const model = require("../../../src/levels/model");
const userService = require("../../../src/user/services");

let app;

describe("# Integration Test Create Levels", () => {
  const sandbox = sinon.createSandbox();
  let token = "password";

  before(async () => {
    await database.createDatabase();
    app = await server.start();

    await userService.create("valid_name", token);
  });

  afterEach(async () => {
    await database.clearCollection("levels");
    sandbox.restore();
  });

  after(async () => {
    await database.clearCollection("users");
    await database.dropDatabase();
    await server.stop();
  });

  it("Deve retornar 401 quando não encontrado user", async () => {
    await request(app)
      .post("/levels")
      .set("Authorization", "bearer invalid_Token")
      .send({ level: "valid" })
      .expect(401);
  });

  it("Deve retornar 401 quando não informado token", async () => {
    await request(app)
      .post("/levels")
      .send({ level: "valid" })
      .expect(401);
  });

  it("Deve chamar console.error quando banco de dados falhar", (done) => {
    const createStub = sandbox
      .stub(model, "create")
      .rejects("Internal Server Error");

    sandbox
      .stub(console, "error")
      .withArgs("[ERROR] Controller | create | Level: %s | %o")
      .callsFake(() => {
        sandbox.assert.calledOnce(createStub);
        done();
      });

    request(app)
      .post("/levels")
      .set("Authorization", `bearer ${token}`)
      .send({ level: "valid" })
      .end((err, res) => {
        assert.notOk(err);
        assert.strictEqual(res.statusCode, 201);
      });
  });

  it("Deve retornar 422 quando não informado body", async () => {
    await request(app)
      .post("/levels")
      .set("Authorization", `bearer ${token}`)
      .expect(422);
  });

  it("Deve chamar corretamente model", async () => {
    const description = "valid";
    const createStub = sandbox.stub(model, "create");

    await request(app)
      .post("/levels")
      .set("Authorization", `bearer ${token}`)
      .send({ level: description })
      .expect(201);

    sandbox.assert.calledOnceWithExactly(createStub, "valid");
  });

  it("Deve retornar 201 quando informado body corretamente", async () => {
    await request(app)
      .post("/levels")
      .set("Authorization", `bearer ${token}`)
      .send({ level: "valid" })
      .expect(201);
  });
});
