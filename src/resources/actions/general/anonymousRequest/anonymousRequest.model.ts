import { Schema, model, Types } from 'mongoose';
import type { Action } from '../../../actions';
import type { ActionsGeneral } from '../../general';
import { Urgency } from '../printerIssue';
import { PhoneNumber } from '../../../user';

type AnonymousRequestKind =
  | 'Workplace safety'
  | 'Employee conflict'
  | 'Workplace harassment'
  | 'Company security'
  | 'Diversity and inclusion'
  | 'LGBTQIA+';

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
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      index: true,
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
    },
  },
  {
    timestamps: true,
  }
);

const AnonymousRequestModel = model<AnonymousRequestDocument>(
  'AnonymousRequest',
  anonymousRequestSchema
);

export { AnonymousRequestModel };
export type { AnonymousRequestDocument, AnonymousRequestSchema, AnonymousRequestKind, Urgency };
