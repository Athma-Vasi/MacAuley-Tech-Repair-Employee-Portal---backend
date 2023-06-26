import { Schema, model, Types } from 'mongoose';

import type { ActionsGeneral } from '../actionsGeneral.types';

type AnonymousRequestType =
  | 'workplace safety'
  | 'employee conflict'
  | 'workplace harassment'
  | 'company security'
  | 'diversity and inclusion'
  | 'lgbtqia+';

type AnonymousRequestUrgency = 'low' | 'medium' | 'high';

type AnonymousRequestSchema = {
  userId: Types.ObjectId;
  username: string;
  title: ActionsGeneral;
  secureContactNumber: string;
  secureContactEmail: string;
  requestType: AnonymousRequestType;
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
    secureContactNumber: {
      type: String,
      required: [true, 'SecureContactNumber is required'],
    },
    secureContactEmail: {
      type: String,
      required: [true, 'SecureContactEmail is required'],
    },
    requestType: {
      type: String,
      required: [true, 'RequestType is required'],
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
  AnonymousRequestType,
  AnonymousRequestUrgency,
};
