import mongoose, { Schema, model, Types } from 'mongoose';
import { ActionsGeneral } from '../actionsGeneral.types';
import { Action } from '../..';
import { PhoneNumber } from '../../../user';
import { RequestStatus } from '../../../../types';

type Urgency = 'low' | 'medium' | 'high';

type PrinterIssueSchema = {
  userId: Types.ObjectId;
  username: string;
  action: Action;
  category: ActionsGeneral;

  title: string;
  contactNumber: PhoneNumber | string;
  contactEmail: string;
  dateOfOccurrence: string;
  timeOfOccurrence: string;
  printerMake: string;
  printerModel: string;
  printerSerialNumber: string;
  printerIssueDescription: string;
  urgency: Urgency;
  additionalInformation: string;
  requestStatus: RequestStatus;
};

type PrinterIssueDocument = PrinterIssueSchema & {
  _id: Types.ObjectId;
  createdAt: NativeDate;
  updatedAt: NativeDate;
  __v: number;
};

const printerIssueSchema = new Schema<PrinterIssueSchema>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, 'User is required'],
      ref: 'User', // referring to the User model
      index: true,
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    contactNumber: {
      type: String,
      required: false,
      default: '',
    },
    contactEmail: {
      type: String,
      required: [true, 'ContactEmail is required'],
    },
    printerMake: {
      type: String,
      required: [true, 'PrinterMake is required'],
    },
    printerModel: {
      type: String,
      required: [true, 'PrinterModel is required'],
    },
    printerSerialNumber: {
      type: String,
      required: [true, 'PrinterSerialNumber is required'],
    },
    printerIssueDescription: {
      type: String,
      required: [true, 'PrinterIssueDescription is required'],
    },
    urgency: {
      type: String,
      required: [true, 'Urgency is required'],
    },
    additionalInformation: {
      type: String,
      required: false,
      default: '',
    },
    requestStatus: {
      type: String,
      required: false,
      default: 'pending',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const PrinterIssueModel = model<PrinterIssueDocument>('PrinterIssue', printerIssueSchema);

export { PrinterIssueModel };
export type { PrinterIssueDocument, PrinterIssueSchema, Urgency };
