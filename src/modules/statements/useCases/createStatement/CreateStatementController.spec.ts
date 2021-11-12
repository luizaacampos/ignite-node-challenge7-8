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

  it("Should be able to create a deposit", async () => {
    const resSession = await request(app).post("/api/v1/sessions")
      .send({
        email: 'user@finapi.com',
        password: 'user'
      });

    const { token } = resSession.body;

    const resDeposit = await request(app).post("/api/v1/statements/deposit")
    .send({
      amount: 500,
      description: 'deposit test'
    })
    .set({
      Authorization: `Bearer ${token}`
    });

      expect(resDeposit.status).toBe(201);
      expect(resDeposit.body.amount).toEqual(500);
  });

  it("Should be able to create a withdraw", async () => {
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

    const resWithdraw = await request(app).post("/api/v1/statements/withdraw")
    .send({
      amount: 100,
      description: 'withdraw test'
    })
    .set({
      Authorization: `Bearer ${token}`
    });

      expect(resWithdraw.status).toBe(201);
      expect(resWithdraw.body.amount).toEqual(100);
  });

  it("Should not be able to create a withdraw when user has insufficient funds", async () => {
    const resSession = await request(app).post("/api/v1/sessions")
      .send({
        email: 'user@finapi.com',
        password: 'user'
      });

    const { token } = resSession.body;

    const resFunds = await request(app).post("/api/v1/statements/withdraw")
    .send({
      amount: 5000,
      description: 'withdraw insufficient funds test'
    })
    .set({
      Authorization: `Bearer ${token}`
    });

      expect(resFunds.status).toBe(500);
  });
})
