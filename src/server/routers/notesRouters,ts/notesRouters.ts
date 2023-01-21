import express from "express";
import { getNote, newNote, updateNote } from "../../controllers/notes/notes.js";

const notesRouters = express.Router();

notesRouters.post("/note", newNote);
notesRouters.put("/note/:id", updateNote);
notesRouters.get("/notes", getNote);

export default notesRouters;
