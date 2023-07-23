import { Schema, Types, model } from 'mongoose';
import type { Action } from '../../../actions';
import type { ActionsCompany } from '../../company';
import { RequestStatus } from '../../../../types';

type ExpenseClaimKind =
  | 'Travel and Accomodation'
  | 'Equipment and Supplies'
  | 'Communication and Utilities'
  | 'Training and Certifications'
  | 'Software and Licenses'
  | 'Marketing and Advertising'
  | 'Insurance'
  | 'Rent and Leasing'
  | 'Legal and Professional Fees'
  | 'Miscellaneous';

type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'JPY' | 'CNY';

type ExpenseClaimSchema = {
  userId: Types.ObjectId;
  username: string;
  action: Action;
  category: ActionsCompany;

  uploadedFileId: Types.ObjectId;
  expenseClaimKind: ExpenseClaimKind;
  expenseClaimAmount: number;
  expenseClaimCurrency: Currency;
  expenseClaimDate: NativeDate;
  expenseClaimDescription: string;
  additionalComments: string;
  acknowledgement: boolean;
  requestStatus: RequestStatus;
};

type ExpenseClaimDocument = ExpenseClaimSchema & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

const expenseClaimSchema = new Schema<ExpenseClaimSchema>(
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

    uploadedFileId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Receipt photo ID is required'],
      ref: 'FileUpload',
      index: true,
    },
    expenseClaimKind: {
      type: String,
      required: [true, 'Expense claim type is required'],
    },
    expenseClaimAmount: {
      type: Number,
      required: [true, 'Expense claim amount is required'],
    },
    expenseClaimCurrency: {
      type: String,
      required: [true, 'Expense claim currency is required'],
    },
    expenseClaimDate: {
      type: Date,
      required: [true, 'Expense claim date is required'],
    },
    expenseClaimDescription: {
      type: String,
      required: [true, 'Expense claim description is required'],
    },
    additionalComments: {
      type: String,
      required: false,
      default: '',
    },
    acknowledgement: {
      type: Boolean,
      required: [true, 'Acknowledgement is required'],
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

const ExpenseClaimModel = model<ExpenseClaimDocument>('ExpenseClaim', expenseClaimSchema);

export { ExpenseClaimModel };
export type { ExpenseClaimSchema, ExpenseClaimDocument, ExpenseClaimKind, Currency };
