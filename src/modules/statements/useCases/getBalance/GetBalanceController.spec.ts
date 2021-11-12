import { hash } from 'bcryptjs';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { app } from '../../../../app';
import request from "supertest";
import createConnection from '../../../../shared/infra/typeorm';

let connection: Connection
describe("Create statement controller", () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("user", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at)
      values('${id}', 'user1', 'user@finapi.com', '${password}', 'now()')`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to return user's balance", async () => {
    const resSession = await request(app).post("/api/v1/sessions")
      .send({
        email: 'user@finapi.com',
        password: 'user'
      });

    const { token } = resSession.body;

  await request(app).post("/api/v1/statements/deposit")
    .send({
      amount: 500,
      description: 'deposit test'
    })
    .set({
      Authorization: `Bearer ${token}`
    });

    const resBalance = await request(app).get("/api/v1/statements/balance")
    .set({
      Authorization: `Bearer ${token}`
    });

      expect(resBalance.status).toBe(200);
  });
})
