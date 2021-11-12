import { hash } from 'bcryptjs';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { app } from '../../../../app';
import request from "supertest";
import createConnection from '../../../../shared/infra/typeorm';

let connection: Connection
describe("Authenticate user controller", () => {

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

  it("Should be able to authenticate a user", async () => {
    const resSession = await request(app).post("/api/v1/sessions")
      .send({
        email: 'user@finapi.com',
        password: 'user'
      });

      expect(resSession.status).toBe(200);
  });

  it("Should not be able to authenticate a user with wrong email", async () => {
    const resSession = await request(app).post("/api/v1/sessions")
      .send({
        email: 'wrongUser@finapi.com',
        password: 'user'
      });

      expect(resSession.status).toBe(401);
  });

  it("Should not be able to authenticate a user with wrong password", async () => {
    const resSession = await request(app).post("/api/v1/sessions")
      .send({
        email: 'user@finapi.com',
        password: 'wronguser'
      });

      expect(resSession.status).toBe(401);
  });
})
