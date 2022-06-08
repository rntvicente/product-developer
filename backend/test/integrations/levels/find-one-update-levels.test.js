const sinon = require("sinon");
const request = require("supertest");
const Chance = require("chance");
const { assert } = require("chai");

const fixture = require("../../fixtures");
const database = require("../../database");
const server = require("../../../src/server");
const model = require("../../../src/levels/model");
const userService = require("../../../src/user/services");

let app;

describe("# Integration Test FindOneAndUpdate Level", () => {
  const chance = new Chance();
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

  it("Deve retornar 401 quando token invalido", async () => {
    await request(app)
      .put(`/levels/${idEstagiario}`)
      .set("Authorization", "bearer invalid_Token")
      .send({ level: chance.word({ length: 15 }) })
      .expect(401);
  });

  it("Deve retornar 401 quando não informado token", async () => {
    await request(app)
      .put(`/levels/${idEstagiario}`)
      .send({ level: chance.word({ length: 15 }) })
      .expect(401);
  });

  it("Deve receber 500 quando Banco de Dados falhar", async () => {
    const findOneAndUpdateStub = sandbox
      .stub(model, "findOneAndUpdate")
      .callsFake((arg1) => {
        throw new Error("Internal Server Error");
      });

    await request(app)
      .put(`/levels/${idEstagiario}`)
      .set("Authorization", `bearer ${token}`)
      .send({ level: chance.word({ length: 15 }) })
      .expect(500);

    sandbox.assert.calledOnce(findOneAndUpdateStub);
  });

  it("Deve retornar 422 quando informado mais de 15 caracteres para o campo level", async () => {
    await request(app)
      .put(`/levels/${idEstagiario}`)
      .set("Authorization", `bearer ${token}`)
      .send({ level: chance.word({ length: 20 }) })
      .expect(422);

    await request(app)
      .put(`/levels/${idEstagiario}`)
      .set("Authorization", `bearer ${token}`)
      .send({ level: chance.word({ length: 2 }) })
      .expect(422);
  });

  it("Deve retornar 204 quando não encontrado level", async () => {
    const id = chance.hash({ length: 24 });

    await request(app)
      .put(`/levels/${id}`)
      .set("Authorization", `bearer ${token}`)
      .send({ level: chance.word({ length: 15 }) })
      .expect(204);
  });

  it("Deve atualizar registro corretamente", async () => {
    const level = chance.word({ length: 15 });

    await request(app)
      .put(`/levels/${idEstagiario}`)
      .set("Authorization", `bearer ${token}`)
      .send({ level })
      .expect(200);

    const coll = await database.getCollection("levels");
    const expected = await coll.findOne({ level });

    assert.isOk(expected);
  });
});
