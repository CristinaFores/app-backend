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
import Note from "../../../dataBase/models/Notes";

let server: MongoMemoryServer;

const requestUserToken = jwt.sign(
  { user: "Cristina", id: "6384fe9a96794a4b19432655" },
  environment.jwtSecret
);

const requestUser2Token = jwt.sign(
  { user: "Cristina2", id: "2" },
  environment.jwtSecret
);

const noteId = "6384fe9a96794a4b19432654";
const noteList = [
  {
    title: "12345678",
    description: "esto es mi primera nota",
    imagePaths: [""],
    buckpicture: [""],
    _id: noteId,
    owner: "6384fe9a96794a4b19432655",
  },
];

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
    test("Then the note is created", async () => {
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

describe("Given a PATCH /note/:id enpoint", () => {
  beforeEach(async () => {
    await Note.create(noteList);
  });
  describe("When i request to update a valid id", () => {
    test("Then it should return the update note", async () => {
      const note = await request(app)
        .patch(`/note/${noteId}`)
        .field("title", "12345678")
        .set("Authorization", `Bearer ${requestUserToken}`)
        .set("Content-Type", "application/json")
        .expect(200);

      expect(note.body).toMatchObject({
        title: "12345678",
      });
    });
  });

  describe("When a user tries to update a note that is not his", () => {
    describe("When a user tries to update a note that is not his", () => {
      test("Then it should respond with a 403 status", async () => {
        await request(app)
          .patch(`/note/${noteId}`)
          .field("title", "12345678")
          .set("Authorization", `Bearer ${requestUser2Token}`)
          .set("Content-Type", "application/json")
          .expect(403);
      });
    });
    describe("When I request to update an invalid id", () => {
      test("Then it should respond with a 400 status", async () => {
        await request(app)
          .patch(`/note/1234`)
          .field("title", "12345678")
          .set("Authorization", `Bearer ${requestUserToken}`)
          .set("Content-Type", "application/json")
          .expect(400);
      });
    });
  });
});
