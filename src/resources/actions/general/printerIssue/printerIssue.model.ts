import mongoose, { Schema, model, Types } from 'mongoose';
import { ActionsGeneral } from '../actionsGeneral.types';
import { Action } from '../..';
import { PhoneNumber } from '../../../user';
import { RequestStatus } from '../../../../types';

type Urgency = 'low' | 'medium' | 'high';

type PrinterMake =
  | 'HP'
  | 'Canon'
  | 'Epson'
  | 'Brother'
  | 'Xerox'
  | 'Ricoh'
  | 'Lexmark'
  | 'Dell'
  | 'Kyocera'
  | 'Sharp'
  | 'Konica Minolta'
  | 'Toshiba TEC'
  | 'OKI'
  | 'Panasonic'
  | 'Fujitsu'
  | 'Zebra Technologies';

type TimeRailway = `${number}${number}:${number}${number}`;

type PrinterIssueSchema = {
  userId: Types.ObjectId;
  username: string;
  action: Action;
  category: ActionsGeneral;

  title: string;
  contactNumber: PhoneNumber | string;
  contactEmail: string;
  dateOfOccurrence: NativeDate;
  timeOfOccurrence: TimeRailway;
  printerMake: PrinterMake;
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
    },
    action: {
      type: String,
      required: [true, 'Action is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
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
    dateOfOccurrence: {
      type: Date,
      required: [true, 'DateOfOccurrence is required'],
    },
    timeOfOccurrence: {
      type: String,
      required: [true, 'TimeOfOccurrence is required'],
    },
    printerMake: {
      type: String,
      required: [true, 'PrinterMake is required'],
      index: true,
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
      index: true,
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

// text indexes for search
printerIssueSchema.index({
  username: 'text',
  title: 'text',
  contactNumber: 'text',
  contactEmail: 'text',
  printerModel: 'text',
  printerSerialNumber: 'text',
  printerIssueDescription: 'text',
  additionalInformation: 'text',
});

const PrinterIssueModel = model<PrinterIssueDocument>('PrinterIssue', printerIssueSchema);

export { PrinterIssueModel };
export type { PrinterIssueDocument, PrinterIssueSchema, Urgency, PrinterMake, TimeRailway };
