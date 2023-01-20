import type { Response, NextFunction } from "express";
import CustomError from "../../../CustomError/CustomError.js";
import type { NoteStructure } from "../../../dataBase/models/Notes.js";
import Note from "../../../dataBase/models/Notes.js";
import type { CustomRequest } from "../../../types/types.js";

export const newNote = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;

  const { title, description } = req.body as NoteStructure;

  try {
    const note = {
      title,
      description,
      owner: userId,
      date: new Date(),
    };

    const newNotes = await Note.create(note);

    return res.status(201).json(newNotes);
  } catch (error: unknown) {
    next(
      new CustomError((error as Error).message, 400, "Error creating the post")
    );
  }
};
