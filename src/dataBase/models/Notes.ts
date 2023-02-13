import type { InferSchemaType } from "mongoose";
import { model, Schema } from "mongoose";

const noteSchema = new Schema({
  title: {
    type: String,
    required: true,
    min: 2,
    max: 50,
  },
  description: {
    type: String,
    required: true,
    min: 2,
    max: 160,
  },
  location: {
    type: String,
  },

  imagePaths: [
    {
      type: String,
    },
  ],
  buckpicture: [
    {
      type: String,
    },
  ],

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  date: {
    type: Date,
  },

  category: {
    type: String,
  },

  status: {
    type: String,
  },
});

const Note = model("Note", noteSchema, "notes");
export type NoteStructure = InferSchemaType<typeof noteSchema>;

export default Note;
