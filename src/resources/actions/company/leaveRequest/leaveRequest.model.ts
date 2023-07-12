import { Schema, Types, model } from 'mongoose';
import type { Action } from '../../../actions';
import type { ActionsCompany } from '../../company';

type ReasonForLeave =
  | 'Vacation'
  | 'Medical'
  | 'Parental'
  | 'Bereavement'
  | 'Jury Duty'
  | 'Military'
  | 'Education'
  | 'Religious'
  | 'Other';

type LeaveRequestSchema = {
  userId: Types.ObjectId;
  username: string;
  action: Action;
  category: ActionsCompany;

  startDate: NativeDate;
  endDate: NativeDate;
  reasonForLeave: ReasonForLeave;
  delegatedToEmployee: string;
  delegatedResponsibilities: string;
  additionalComments: string;
  acknowledgement: boolean;
};

type LeaveRequestDocument = LeaveRequestSchema & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

const leaveRequestSchema = new Schema<LeaveRequestSchema>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, 'User ID is required'],
      ref: 'User',
      index: true,
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      index: true,
    },
    action: {
      type: String,
      required: [true, 'Action is required'],
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      index: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    reasonForLeave: {
      type: String,
      required: [true, 'Reason for leave is required'],
    },
    delegatedToEmployee: {
      type: String,
      required: false,
      default: '',
    },
    delegatedResponsibilities: {
      type: String,
      required: false,
      default: '',
    },
    additionalComments: {
      type: String,
      required: false,
      default: '',
    },
    acknowledgement: {
      type: Boolean,
      required: [true, 'Acknowledgement is required'],
      default: false,
    },
  },
  { timestamps: true }
);

const LeaveRequestModel = model<LeaveRequestDocument>('LeaveRequest', leaveRequestSchema);

export { LeaveRequestModel };
export type { LeaveRequestSchema, LeaveRequestDocument, ReasonForLeave };
