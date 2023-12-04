import { Schema, Types, model } from "mongoose";

import type { Country, PhoneNumber, PostalCode, Province, StatesUS } from "../../../user";
import { RequestStatus } from "../../../../types";

type AddressChangeSchema = {
  userId: Types.ObjectId;
  username: string;
  contactNumber: PhoneNumber;
  addressLine: string;
  city: string;
  province: Province;
  state: StatesUS;
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
      required: [true, "User ID is required"],
      ref: "User",
      index: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    contactNumber: {
      type: String,
      required: [true, "Contact number is required"],
    },
    addressLine: {
      type: String,
      required: [true, "Address line is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    province: {
      type: String,
      required: [true, "Province is required"],
      index: true,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      index: true,
    },
    postalCode: {
      type: String,
      required: [true, "Postal code is required"],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
    },
    acknowledgement: {
      type: Boolean,
      required: [true, "Acknowledgement is required"],
      default: false,
    },
    requestStatus: {
      type: String,
      required: false,
      default: "pending",
      index: true,
    },
  },
  { timestamps: true }
);

addressChangeSchema.index({
  username: "text",
  contactNumber: "text",
  addressLine: "text",
  city: "text",
  postalCode: "text",
});

const AddressChangeModel = model<AddressChangeDocument>(
  "AddressChange",
  addressChangeSchema
);

export { AddressChangeModel };
export type { AddressChangeSchema, AddressChangeDocument };
