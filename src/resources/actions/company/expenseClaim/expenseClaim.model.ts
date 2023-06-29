import { Schema, Types, model } from 'mongoose';

type ExpenseClaimType =
  | 'Travel and Accomodation'
  | 'Equipment and Supplies'
  | 'Communication and Utilities'
  | 'Training and Certifications'
  | 'Miscellaneous';

type Currency = 'CAD' | 'USD';

type ExpenseClaimSchema = {
  userId: Types.ObjectId;
  username: string;
  receiptPhotoId: Types.ObjectId;
  expenseClaimType: ExpenseClaimType;
  expenseClaimAmount: number;
  expenseClaimCurrency: Currency;
  expenseClaimDate: NativeDate;
  expenseClaimDescription: string;
  additionalComments: string;
  acknowledgement: boolean;
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
    receiptPhotoId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Receipt photo ID is required'],
      ref: 'PhotoUpload',
      index: true,
    },
    expenseClaimType: {
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
  },
  {
    timestamps: true,
  }
);

const ExpenseClaimModel = model<ExpenseClaimDocument>('ExpenseClaim', expenseClaimSchema);

export { ExpenseClaimModel };
export type { ExpenseClaimSchema, ExpenseClaimDocument, ExpenseClaimType, Currency };
