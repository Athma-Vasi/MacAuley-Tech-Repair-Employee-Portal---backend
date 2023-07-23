import { Schema, Types, model } from 'mongoose';
import type { Action } from '../../../actions';
import type { ActionsCompany } from '../../company';
import { RequestStatus } from '../../../../types';

type BenefitsPlanKind =
  | 'Health'
  | 'Dental'
  | 'Vision'
  | 'Life'
  | 'Disability'
  | 'Retirement'
  | 'Education'
  | 'Other';

type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'JPY' | 'CNY';

type BenefitsSchema = {
  userId: Types.ObjectId;
  username: string;
  action: Action;
  category: ActionsCompany;

  planName: string;
  planDescription: string;
  planKind: BenefitsPlanKind;
  planStartDate: string;
  isPlanActive: boolean;
  currency: Currency;
  monthlyPremium: number;
  employerContribution: number;
  employeeContribution: number;
  requestStatus: RequestStatus;
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

    planName: {
      type: String,
      required: [true, 'Plan name is required'],
      index: true,
    },
    planDescription: {
      type: String,
      required: false,
      default: '',
    },
    planKind: {
      type: String,
      required: [true, 'Plan kind is required'],
    },
    planStartDate: {
      type: String,
      required: [true, 'Plan start date is required'],
    },
    isPlanActive: {
      type: Boolean,
      required: [true, 'Plan active status is required'],
    },
    currency: {
      type: String,
      required: [true, 'Currency is required'],
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

    requestStatus: {
      type: String,
      required: false,
      default: 'pending',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const BenefitsModel = model<BenefitsDocument>('Benefits', benefitsSchema);

export { BenefitsModel };
export type { BenefitsSchema, BenefitsDocument, BenefitsPlanKind, Currency };
