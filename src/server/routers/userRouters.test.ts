import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { connectDb } from "../../dataBase";
import User from "../../dataBase/models/User";
import app from "../app";
import request from "supertest";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDb(server.getUri());
});

beforeEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await server.stop();
});

const expectUser = {
  username: "Cristina",
  password: "123456789",
  email: "cris@email.com",
};

describe("Given a POST/ register enpoint", () => {
  describe("When i send vaild body", () => {
    test("Then it response with status code 201 an the user", async () => {
      const expectStatus = 201;

      const response = await request(app)
        .post("/register")
        .send(expectUser)
        .expect(expectStatus);
      expect(response.body).toHaveProperty("user");
    });
  });

  describe("When i send email 'that already exists'", () => {
    test("Then it return a 400 status error", async () => {
      const expectStatus = 400;

      await User.create(expectUser);

      const response = await request(app)
        .post("/register")
        .send(expectUser)
        .expect(expectStatus);

      expect(response.body.error).toBe("Email already exists");
    });
  });
});
