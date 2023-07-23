import { Schema, model, Types } from 'mongoose';

type NoteSchema = {
  userId: Types.ObjectId;
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
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, 'User is required'],
      ref: 'User', // referring to the User model
      // index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      index: true,
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

export { NoteModel };
export type { NoteSchema, NoteDocument };
