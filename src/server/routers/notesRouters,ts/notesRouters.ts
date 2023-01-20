import express from "express";
import { newNote } from "../../controllers/notes/notes.js";

const notesRouters = express.Router();

notesRouters.post("/note", newNote);

export default notesRouters;
