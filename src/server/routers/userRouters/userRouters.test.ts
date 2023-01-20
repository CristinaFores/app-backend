import "../../../loadEnviroment";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { connectDb } from "../../../dataBase";
import bcrypt from "bcrypt";
import User from "../../../dataBase/models/User";
import app from "../../app";
import request from "supertest";
import type { RegisterData } from "../../controllers/users/types";

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

describe("Given POST/ login endpoint", () => {
  const registerctUser: RegisterData = {
    username: "Cristina",
    password: "123456789",
    email: "cris@email.com",
  };

  describe("When it recieves a request the username: 'Cristina' , password:'0123456789',  email: 'cris@email.com' ", () => {
    test("Then its should response status code 200 and the user", async () => {
      const expectStatus = 200;

      const hashedPassword = await bcrypt.hash(registerctUser.password, 10);

      await User.create({
        username: registerctUser.username,
        password: hashedPassword,
        email: registerctUser.email,
      });

      const response = await request(app)
        .post("/login")
        .send(registerctUser)
        .expect(expectStatus);

      expect(response.body).toHaveProperty("token");
    });
  });

  describe("When it recieves a request the username: 'Cristina' , password'0123456789',  email: 'cris@email.com'", () => {
    test("Then it should respond with a response status 401, and the message 'Wrong credentials'", async () => {
      const expectedStatus = 401;

      const response = await request(app)
        .post("/login")
        .send(registerctUser)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error", "Wrong credentials");
    });
  });
});
