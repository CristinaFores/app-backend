import express from "express";
import { newNote, updateNote } from "../../controllers/notes/notes.js";

const notesRouters = express.Router();

notesRouters.post("/note", newNote);
notesRouters.put("/note", updateNote);

export default notesRouters;
