import { Schema, model, Types } from 'mongoose';
import type { Action } from '../../../actions';
import type { ActionsGeneral } from '../../general';

type AnonymousRequestKind =
  | 'workplace safety'
  | 'employee conflict'
  | 'workplace harassment'
  | 'company security'
  | 'diversity and inclusion'
  | 'lgbtqia+';

type AnonymousRequestUrgency = 'low' | 'medium' | 'high';

type AnonymousRequestSchema = {
  action: Action;
  category: ActionsGeneral;

  title: ActionsGeneral;
  secureContactNumber: string;
  secureContactEmail: string;
  requestKind: AnonymousRequestKind;
  requestDescription: string;
  additionalInformation: string;
  urgency: AnonymousRequestUrgency;
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
      required: [true, 'SecureContactNumber is required'],
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
      required: [true, 'AdditionalInformation is required'],
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
export type {
  AnonymousRequestDocument,
  AnonymousRequestSchema,
  AnonymousRequestKind,
  AnonymousRequestUrgency,
};
