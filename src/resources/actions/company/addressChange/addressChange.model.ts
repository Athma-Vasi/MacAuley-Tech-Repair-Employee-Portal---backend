import { Schema, Types, model } from 'mongoose';

import type { Action } from '../../../actions';
import type { ActionsCompany } from '../../../actions/company';
import type { Country, PostalCode } from '../../../user';

type AddressChangeSchema = {
  userId: Types.ObjectId;
  username: string;
  action: Action;
  category: ActionsCompany;

  newAddress: {
    addressLine1: string;
    city: string;
    province: string;
    state: string;
    postalCode: PostalCode;
    country: Country;
  };
  acknowledgement: boolean;
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

    newAddress: {
      addressLine1: {
        type: String,
        required: [true, 'Address line 1 is required'],
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
    },
    acknowledgement: {
      type: Boolean,
      required: [true, 'Acknowledgement is required'],
      default: false,
    },
  },
  { timestamps: true }
);

const AddressChangeModel = model<AddressChangeDocument>('AddressChange', addressChangeSchema);

export { AddressChangeModel };
export type { AddressChangeSchema, AddressChangeDocument };
