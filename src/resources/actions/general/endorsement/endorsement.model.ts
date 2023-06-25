import mongoose, { Schema, model, Types } from 'mongoose';

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
  user: Types.ObjectId;
  section: 'company' | 'general';
  title: 'endorsement';
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

const endorseSchema = new Schema<EndorsementSchema>(
  {
    user: {
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

const EndorsementModel = model<EndorsementDocument>('Endorse', endorseSchema);

export { EndorsementModel };
export type { EndorsementSchema, EndorsementDocument, EmployeeAttributes };
