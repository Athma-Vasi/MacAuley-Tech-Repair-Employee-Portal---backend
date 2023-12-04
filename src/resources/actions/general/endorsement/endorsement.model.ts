import { Schema, model, Types } from "mongoose";

import type { ActionsGeneral } from "..";
import type { Action } from "../../../actions";
import { RequestStatus } from "../../../../types";

type EmployeeAttributes = (
  | "teamwork and collaboration"
  | "leadership and mentorship"
  | "technical expertise"
  | "adaptibility and flexibility"
  | "problem solving"
  | "customer service"
  | "initiative and proactivity"
  | "communication"
  | "reliability and dependability"
)[];

type EndorsementSchema = {
  userId: Types.ObjectId;
  title: string;
  username: string;
  userToBeEndorsed: string;
  summaryOfEndorsement: string;
  attributeEndorsed: EmployeeAttributes;
  requestStatus: RequestStatus;
};

type EndorsementDocument = EndorsementSchema & {
  _id: Types.ObjectId;
  createdAt: NativeDate;
  updatedAt: NativeDate;
  __v: number;
};

const endorsementSchema = new Schema<EndorsementSchema>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, "User is required"],
      ref: "User",
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    userToBeEndorsed: {
      type: String,
      required: [true, "UserToBeEndorsed is required"],
    },
    summaryOfEndorsement: {
      type: String,
      required: [true, "SummaryOfEndorsement is required"],
    },
    attributeEndorsed: {
      type: [String],
      required: [true, "AttributeEndorsed is required"],
      index: true,
    },
    requestStatus: {
      type: String,
      required: false,
      default: "pending",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// text index for searching
endorsementSchema.index({
  username: "text",
  userToBeEndorsed: "text",
  title: "text",
  summaryOfEndorsement: "text",
  attributeEndorsed: "text",
});

const EndorsementModel = model<EndorsementDocument>("Endorsement", endorsementSchema);

export { EndorsementModel };
export type { EndorsementSchema, EndorsementDocument, EmployeeAttributes };
