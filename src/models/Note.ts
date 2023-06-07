import mongoose, { Schema, model, Types } from 'mongoose';

const AutoIncrement = require('mongoose-sequence')(mongoose);

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

// this is for auto incrementing the ticket number for each note created by a user
noteSchema.plugin(AutoIncrement, {
  inc_field: 'ticket',
  id: 'ticketNums',
  start_seq: 500,
});

const NoteModel = model('Note', noteSchema);

export { NoteModel, NoteDocument, NoteSchema };
