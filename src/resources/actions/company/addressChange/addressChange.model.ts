import { Schema, Types, model } from 'mongoose';

import type { Action } from '../../../actions';
import type { ActionsCompany } from '../../../actions/company';
import type { Country, PhoneNumber, PostalCode, Province, StatesUS } from '../../../user';
import { RequestStatus } from '../../../../types';

type AddressChangeSchema = {
  userId: Types.ObjectId;
  username: string;
  action: Action;
  category: ActionsCompany;

  contactNumber: PhoneNumber;
  addressLine: string;
  city: string;
  province?: Province;
  state?: StatesUS;
  postalCode: PostalCode;
  country: Country;

  acknowledgement: boolean;
  requestStatus: RequestStatus;
};

type AddressChangeDocument = AddressChangeSchema & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

const addressChangeSchema = new Schema<AddressChangeSchema>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, 'User ID is required'],
      ref: 'User',
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

    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
    },
    addressLine: {
      type: String,
      required: [true, 'Address line is required'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
    },
    province: {
      type: String,
      required: false,
      default: '',
    },
    state: {
      type: String,
      required: false,
      default: '',
    },
    postalCode: {
      type: String,
      required: [true, 'Postal code is required'],
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
    },
    acknowledgement: {
      type: Boolean,
      required: [true, 'Acknowledgement is required'],
      default: false,
    },
    requestStatus: {
      type: String,
      required: false,
      default: 'pending',
    },
  },
  { timestamps: true }
);

addressChangeSchema.index({
  userId: 1,
  username: 'text',
  contactNumber: 'text',
  addressLine: 'text',
  city: 'text',
  postalCode: 'text',
  requestStatus: 1,
});

const AddressChangeModel = model<AddressChangeDocument>('AddressChange', addressChangeSchema);

export { AddressChangeModel };
export type { AddressChangeSchema, AddressChangeDocument };
