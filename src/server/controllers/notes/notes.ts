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

export const updateNote = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;
  const { title, description } = req.body as NoteStructure;

  try {
    const note = await Note.findOne({ _id: req.params.id });

    if (note.owner.toString() !== userId) {
      next(new CustomError("Not allowed", 403, " Update not allowed"));
    }

    const uodateNote = await Note.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
      },
      {
        new: true,
      }
    );

    res.status(200).json(uodateNote);
  } catch (error: unknown) {
    next(new CustomError((error as Error).message, 400, "Error updating post"));
  }
};
