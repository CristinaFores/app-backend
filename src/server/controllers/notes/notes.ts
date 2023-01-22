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

  const { title, description, imagePaths, buckpicture } =
    req.body as NoteStructure;

  try {
    const note = {
      title,
      description,
      imagePaths,
      buckpicture,
      owner: userId,
      date: new Date(),
    };

    const newNote = await Note.create(note);

    return res
      .status(201)
      .json({ ...newNote.toJSON(), image: note.imagePaths });
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
      return;
    }

    const updateNote = await Note.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
      },
      {
        new: true,
      }
    );

    res.status(200).json(updateNote);
  } catch (error: unknown) {
    next(new CustomError((error as Error).message, 400, "Error updating post"));
  }
};

export const getNote = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;

  try {
    const notes = await Note.find({ owner: userId }).populate("owner");

    res.status(200).json({ notes });
  } catch (error: unknown) {
    next(
      new CustomError(
        (error as Error).message,
        500,
        "Database doesn't work, try again later"
      )
    );
  }
};

export const deleteNoteById = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;
  const { id } = req.params;

  try {
    const note = await Note.findById({ _id: id });
    if (note.owner.toString() !== userId) {
      next(new CustomError("Not allowed", 403, " Delete not allowed"));
      return;
    }

    await note.delete();

    res.status(200).json({ message: "Note Deleted successfully" });
  } catch (error: unknown) {
    next(new CustomError((error as Error).message, 400, "Note not found no"));
  }
};

export const getNoteById = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const note = await Note.findById(id);

    res.status(200).json(note);
  } catch (error: unknown) {
    next(new CustomError((error as Error).message, 400, "Invalid Id"));
  }
};
