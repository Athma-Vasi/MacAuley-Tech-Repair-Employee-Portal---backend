import mongoose, { Schema, model, Types } from 'mongoose';

type NoteSchema = {
  user: Types.ObjectId;
  title: string;
  text: string;
  completed: boolean;
};

type NoteDocument = NoteSchema & {
  _id: Types.ObjectId;
  createdAt: NativeDate;
  updatedAt: NativeDate;
  __v: number;
};

const noteSchema = new Schema<NoteSchema>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User is required'],
      ref: 'User', // referring to the User model
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    text: {
      type: String,
      required: [true, 'Text is required'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const NoteModel = model('Note', noteSchema);

export { NoteModel, NoteDocument, NoteSchema };
