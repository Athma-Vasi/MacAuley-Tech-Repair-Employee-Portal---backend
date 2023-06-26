import mongoose, { Schema, model, Types } from 'mongoose';

import type { ActionsGeneral } from '../actionsGeneral.types';

type EmployeeAttributes =
  | 'teamwork and collaboration'
  | 'leadership and mentorship'
  | 'technical expertise'
  | 'adaptibility and flexibility'
  | 'problem solving'
  | 'customer service'
  | 'initiative and proactivity'
  | 'communication'
  | 'reliability and dependability';

type EndorsementSchema = {
  userId: Types.ObjectId;
  section: 'company' | 'general';
  title: ActionsGeneral;
  username: string;
  userToBeEndorsed: string;
  summaryOfEndorsement: string;
  attributeEndorsed: EmployeeAttributes;
};

type EndorsementDocument = EndorsementSchema & {
  _id: Types.ObjectId;
  createdAt: NativeDate;
  updatedAt: NativeDate;
  __v: number;
};

const endorsementSchema = new Schema<EndorsementSchema>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, 'User is required'],
      ref: 'User', // referring to the User model
      index: true,
    },
    section: {
      type: String,
      required: [true, 'Section is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      index: true,
    },
    userToBeEndorsed: {
      type: String,
      required: [true, 'UserToBeEndorsed is required'],
    },
    summaryOfEndorsement: {
      type: String,
      required: [true, 'SummaryOfEndorsement is required'],
    },
    attributeEndorsed: {
      type: String,
      required: [true, 'AttributeEndorsed is required'],
    },
  },
  {
    timestamps: true,
  }
);

const EndorsementModel = model<EndorsementDocument>('Endorsement', endorsementSchema);

export { EndorsementModel };
export type { EndorsementSchema, EndorsementDocument, EmployeeAttributes };
