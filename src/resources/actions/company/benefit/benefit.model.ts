import { Schema, Types, model } from "mongoose";
import { RequestStatus } from "../../../../types";

type BenefitsPlanKind =
  | "Health"
  | "Dental"
  | "Vision"
  | "Life"
  | "Disability"
  | "Retirement"
  | "Education"
  | "Other";

type Currency = "USD" | "CAD";

type BenefitSchema = {
  currency: Currency;
  employeeContribution: number;
  employerContribution: number;
  isPlanActive: boolean;
  monthlyPremium: number;
  planDescription: string;
  planKind: BenefitsPlanKind;
  planName: string;
  planStartDate: string;
  requestStatus: RequestStatus;
  userId: Types.ObjectId;
  username: string;
};

type BenefitDocument = BenefitSchema & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

const benefitsSchema = new Schema<BenefitSchema>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, "User ID is required"],
      ref: "User",
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      index: true,
    },

    planName: {
      type: String,
      required: [true, "Plan name is required"],
    },
    planDescription: {
      type: String,
      required: false,
      default: "",
    },
    planKind: {
      type: String,
      required: [true, "Plan kind is required"],
      index: true,
    },
    planStartDate: {
      type: String,
      required: [true, "Plan start date is required"],
    },
    isPlanActive: {
      type: Boolean,
      required: [true, "Plan active status is required"],
      index: true,
    },
    currency: {
      type: String,
      required: [true, "Currency is required"],
      index: true,
    },
    monthlyPremium: {
      type: Number,
      required: [true, "Monthly premium is required"],
    },
    employerContribution: {
      type: Number,
      required: [true, "Employer contribution is required"],
    },
    employeeContribution: {
      type: Number,
      required: [true, "Employee contribution is required"],
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

benefitsSchema.index({
  username: "text",
  planName: "text",
  planDescription: "text",
});

const BenefitModel = model<BenefitDocument>("Benefit", benefitsSchema);

export { BenefitModel };
export type { BenefitSchema, BenefitDocument, BenefitsPlanKind, Currency };
