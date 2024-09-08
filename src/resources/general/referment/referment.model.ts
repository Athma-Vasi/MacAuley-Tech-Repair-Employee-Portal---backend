import { model, Schema, Types } from "mongoose";
import { Department, JobPosition, PhoneNumber } from "../../user";
import { RequestStatus } from "../../../types";

type RefermentSchema = {
  userId: Types.ObjectId;
  username: string;
  candidateFullName: string;
  candidateEmail: string;
  candidateContactNumber: PhoneNumber | string;
  candidateCurrentJobTitle: string;
  candidateCurrentCompany: string;
  candidateProfileUrl: string;

  departmentReferredFor: Department;
  positionReferredFor: JobPosition;
  positionJobDescription: string;
  referralReason: string;
  additionalInformation: string;
  privacyConsent: boolean;
  requestStatus: RequestStatus;
};

type RefermentDocument = RefermentSchema & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

const refermentSchema = new Schema<RefermentSchema>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, "userId is required"],
      ref: "User",
      index: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    candidateFullName: {
      type: String,
      required: [true, "CandidateFullName is required"],
    },
    candidateEmail: {
      type: String,
      required: [true, "CandidateEmail is required"],
    },
    candidateContactNumber: {
      type: String,
      required: [true, "CandidateContactNumber is required"],
    },
    candidateCurrentJobTitle: {
      type: String,
      required: [true, "CandidateCurrentJobTitle is required"],
    },
    candidateCurrentCompany: {
      type: String,
      required: [true, "CandidateCurrentCompany is required"],
    },
    candidateProfileUrl: {
      type: String,
      required: false,
      default: "",
    },

    departmentReferredFor: {
      type: String,
      required: [true, "DepartmentReferredFor is required"],
      index: true,
    },
    positionReferredFor: {
      type: String,
      required: [true, "PositionReferredFor is required"],
      index: true,
    },
    positionJobDescription: {
      type: String,
      required: false,
      default: "",
    },
    referralReason: {
      type: String,
      required: [true, "ReferralReason is required"],
    },
    additionalInformation: {
      type: String,
      required: false,
      default: "",
    },
    privacyConsent: {
      type: Boolean,
      required: [true, "PrivacyConsent is required"],
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
  },
);

// text indexes for search
refermentSchema.index({
  username: "text",
  candidateFullName: "text",
  candidateEmail: "text",
  candidateContactNumber: "text",
  candidateCurrentJobTitle: "text",
  candidateCurrentCompany: "text",
  candidateProfileUrl: "text",
  positionJobDescription: "text",
  referralReason: "text",
  additionalInformation: "text",
});

const RefermentModel = model<RefermentDocument>("Referment", refermentSchema);

export { RefermentModel };
export type { RefermentDocument, RefermentSchema };
