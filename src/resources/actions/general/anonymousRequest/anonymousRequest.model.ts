import { Schema, model, Types } from 'mongoose';
import type { Action } from '../../../actions';
import type { ActionsGeneral } from '../../general';
import { Urgency } from '../printerIssue';
import { PhoneNumber } from '../../../user';
import { RequestStatus } from '../../../../types';

type AnonymousRequestKind =
  | 'Benefits and compensation'
  | 'Bullying and intimidation'
  | 'Company security'
  | 'Customer service'
  | 'Discrimination'
  | 'Diversity and inclusion'
  | 'Employee conflict'
  | 'Ethical concerns'
  | 'LGBTQIA+'
  | 'Managerial issues'
  | 'Environmental concerns'
  | 'Workload and stress'
  | 'Workplace safety'
  | 'Workplace harassment';

type AnonymousRequestSchema = {
  // action and category are added in the create handler
  action: Action;
  category: ActionsGeneral;

  title: string;
  secureContactNumber: PhoneNumber | string;
  secureContactEmail: string;
  requestKind: AnonymousRequestKind;
  requestDescription: string;
  additionalInformation: string;
  urgency: Urgency;
  requestStatus: RequestStatus;
};

type AnonymousRequestDocument = AnonymousRequestSchema & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

const anonymousRequestSchema = new Schema<AnonymousRequestSchema>(
  {
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
    secureContactNumber: {
      type: String,
      required: false,
      default: '',
    },
    secureContactEmail: {
      type: String,
      required: [true, 'SecureContactEmail is required'],
    },
    requestKind: {
      type: String,
      required: [true, 'RequestKind is required'],
      index: true,
    },
    requestDescription: {
      type: String,
      required: [true, 'RequestDescription is required'],
    },
    additionalInformation: {
      type: String,
      required: false,
      default: '',
    },
    urgency: {
      type: String,
      required: [true, 'Urgency is required'],
      index: true,
    },
    requestStatus: {
      type: String,
      required: [true, 'RequestStatus is required'],
      default: 'pending',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// text indexes for search
anonymousRequestSchema.index({
  title: 'text',
  secureContactNumber: 'text',
  secureContactEmail: 'text',
  requestDescription: 'text',
  additionalInformation: 'text',
});

const AnonymousRequestModel = model<AnonymousRequestDocument>(
  'AnonymousRequest',
  anonymousRequestSchema
);

export { AnonymousRequestModel };
export type { AnonymousRequestDocument, AnonymousRequestSchema, AnonymousRequestKind, Urgency };
