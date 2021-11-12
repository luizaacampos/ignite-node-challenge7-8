import { hash } from 'bcryptjs';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { app } from '../../../../app';
import request from "supertest";
import createConnection from '../../../../shared/infra/typeorm';

let connection: Connection
describe("Create user controller", () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a new user", async () => {
    const response = await request(app).post("/api/v1/users")
      .send({
        name: 'user test',
        email: 'user@finapi.com',
        password: 'user'
      });

      expect(response.status).toBe(201);
  });

  it("Should not be able to create a new user with a existent email", async () => {
    const response = await request(app).post("/api/v1/users")
      .send({
        name: 'user test',
        email: 'user@finapi.com',
        password: 'user'
      });

      expect(response.status).toBe(400);
  })
})
