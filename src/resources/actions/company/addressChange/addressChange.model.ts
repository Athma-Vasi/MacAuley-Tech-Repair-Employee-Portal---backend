import { Schema, Types, model } from 'mongoose';

import type { Country, PhoneNumber, PostalCode } from '../../../user';

type AddressChangeSchema = {
  userId: Types.ObjectId;
  username: string;
  email: string;
  contactNumber: PhoneNumber;
  newAddress: {
    addressLine1: string;
    city: string;
    province: string;
    state: string;
    postalCode: PostalCode;
    country: Country;
  };
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
    email: {
      type: String,
      required: [true, 'Email is required'],
      index: true,
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
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
  },
  { timestamps: true }
);

const AddressChangeModel = model<AddressChangeDocument>('AddressChange', addressChangeSchema);

export { AddressChangeModel };
export type { AddressChangeSchema, AddressChangeDocument };
