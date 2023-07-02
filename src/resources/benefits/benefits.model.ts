import { Schema, Types, model } from 'mongoose';

type BenefitsPlanKind =
  | 'Health'
  | 'Dental'
  | 'Vision'
  | 'Life'
  | 'Disability'
  | 'Retirement'
  | 'Education'
  | 'Other';

type BenefitsSchema = {
  userId: Types.ObjectId;
  username: string;
  planName: string;
  planDescription: string;
  planKind: BenefitsPlanKind;
  planStartDate: NativeDate;
  isPlanActive: boolean;
  monthlyPremium: number;
  employerContribution: number;
  employeeContribution: number;
};

type BenefitsDocument = BenefitsSchema & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

const benefitsSchema = new Schema<BenefitsSchema>(
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
    planName: {
      type: String,
      required: [true, 'Plan name is required'],
    },
    planDescription: {
      type: String,
      required: [true, 'Plan description is required'],
    },
    planKind: {
      type: String,
      required: [true, 'Plan kind is required'],
    },
    planStartDate: {
      type: Date,
      required: [true, 'Plan start date is required'],
    },
    isPlanActive: {
      type: Boolean,
      required: [true, 'Plan active status is required'],
    },
    monthlyPremium: {
      type: Number,
      required: [true, 'Monthly premium is required'],
    },
    employerContribution: {
      type: Number,
      required: [true, 'Employer contribution is required'],
    },
    employeeContribution: {
      type: Number,
      required: [true, 'Employee contribution is required'],
    },
  },
  {
    timestamps: true,
  }
);

const BenefitsModel = model<BenefitsDocument>('Benefits', benefitsSchema);

export { BenefitsModel };
export type { BenefitsSchema, BenefitsDocument, BenefitsPlanKind };
