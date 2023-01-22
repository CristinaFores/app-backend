import "../../../loadEnviroment";
import environment from "../../../loadEnviroment";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { connectDb } from "../../../dataBase/index";
import Notes from "../../../dataBase/models/Notes";
import request from "supertest";
import app from "../../app";
import jwt from "jsonwebtoken";
import path from "path";

let server: MongoMemoryServer;

const requestUserToken = jwt.sign(
  { user: "Cristina", id: "6384fe9a96794a4b19432655" },
  environment.jwtSecret
);

const requestUser2Token = jwt.sign(
  { user: "Cristina2", id: "2" },
  environment.jwtSecret
);

jest.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    storage: {
      from: () => ({
        upload: jest.fn().mockResolvedValue({ error: null }),
        getPublicUrl: () => ({
          data: {
            publicUrl: "testFileImage.webptestOriginalImage.webp",
          },
        }),
      }),
    },
  }),
}));

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDb(server.getUri());
});

afterAll(async () => {
  await mongoose.connection.close();
  await server.stop();
});

afterEach(async () => {
  await Notes.deleteMany();
});

describe("Given a POST /note enpoint", () => {
  describe("When i send a valid request body", () => {
    test("Then the post is created", async () => {
      const note = {
        title: "12345678",
        description: "esto es mi primer nota",
      };

      const createNotes = await request(app)
        .post("/note")
        .field("title", note.title)
        .field("description", note.description)
        .attach("image", path.join(__dirname, "testImage.jpeg"))
        .set("Authorization", `Bearer ${requestUserToken}`)
        .set("Content-Type", "application/json")
        .expect(201);

      expect(createNotes.body).toMatchObject(note);
    });
  });

  describe("When i send a invalid request body", () => {
    test("Then it should respond with a 400 status", async () => {
      await request(app)
        .post("/note")
        .set("Authorization", `Bearer ${requestUser2Token}`)
        .send("")
        .expect(400);
    });
  });
});
