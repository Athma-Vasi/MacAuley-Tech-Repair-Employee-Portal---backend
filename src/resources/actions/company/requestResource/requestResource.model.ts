import { Schema, Types, model } from "mongoose";
import type { Department } from "../../../user";
import type { Urgency } from "../../general/printerIssue";
import type { Action } from "../../../actions";
import type { ActionsCompany } from "../../company";
import { RequestStatus } from "../../../../types";

type RequestResourceKind = "Hardware" | "Software" | "Access" | "Other";

type RequestResourceSchema = {
  userId: Types.ObjectId;
  username: string;
  department: Department;
  resourceType: RequestResourceKind;
  resourceQuantity: number;
  resourceDescription: string;
  reasonForRequest: string;
  urgency: Urgency;
  dateNeededBy: NativeDate;
  additionalInformation: string;
  requestStatus: RequestStatus;
};

type RequestResourceDocument = RequestResourceSchema & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

const requestResourceSchema = new Schema<RequestResourceSchema>(
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
    department: {
      type: String,
      required: [true, "Department is required"],
      index: true,
    },
    resourceType: {
      type: String,
      required: [true, "Resource type is required"],
      index: true,
    },
    resourceQuantity: {
      type: Number,
      required: [true, "Resource quantity is required"],
    },
    resourceDescription: {
      type: String,
      required: [true, "Resource description is required"],
    },
    reasonForRequest: {
      type: String,
      required: false,
      default: "",
    },
    urgency: {
      type: String,
      required: [true, "Urgency is required"],
      index: true,
    },
    dateNeededBy: {
      type: Date,
      required: [true, "Date needed by is required"],
    },
    additionalInformation: {
      type: String,
      required: false,
      default: "",
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

requestResourceSchema.index({
  username: "text",
  resourceDescription: "text",
  reasonForRequest: "text",
  additionalInformation: "text",
});

const RequestResourceModel = model<RequestResourceDocument>(
  "RequestResource",
  requestResourceSchema
);

export { RequestResourceModel };
export type { RequestResourceSchema, RequestResourceKind, RequestResourceDocument };
