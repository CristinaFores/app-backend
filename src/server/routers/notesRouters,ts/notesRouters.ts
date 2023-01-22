import express from "express";
import multer from "multer";
import {
  deleteNoteById,
  getNote,
  getNoteById,
  newNote,
  updateNote,
} from "../../controllers/notes/notes.js";

import handleImage from "../../middlewares/handleImage/handleImage.js";

const notesRouters = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

notesRouters.post("/note", upload.single("image"), handleImage, newNote);
notesRouters.patch("/note/:id", updateNote);
notesRouters.get("/notes", getNote);
notesRouters.delete("/note/:id", deleteNoteById);
notesRouters.get("/note/:id", getNoteById);

export default notesRouters;
