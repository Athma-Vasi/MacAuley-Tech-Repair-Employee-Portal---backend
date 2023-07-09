import { Schema, Types, model } from 'mongoose';
import type { Department } from '../../../user';
import type { Urgency } from '../../general/printerIssue';
import type { Action } from '../../../actions';
import type { ActionsCompany } from '../../company';

type RequestResourceKind = 'Hardware' | 'Software' | 'Access' | 'Other';

type RequestResourceSchema = {
  userId: Types.ObjectId;
  username: string;
  action: Action;
  category: ActionsCompany;

  department: Department;
  resourceType: RequestResourceKind;
  resourceQuantity: number;
  resourceDescription: string;
  reasonForRequest: string;
  urgency: Urgency;
  dateNeededBy: NativeDate;
  additionalInformation: string;
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

    department: {
      type: String,
      required: [true, 'Department is required'],
    },
    resourceType: {
      type: String,
      required: [true, 'Resource type is required'],
    },
    resourceQuantity: {
      type: Number,
      required: [true, 'Resource quantity is required'],
    },
    resourceDescription: {
      type: String,
      required: [true, 'Resource description is required'],
    },
    reasonForRequest: {
      type: String,
      required: [true, 'Reason for request is required'],
    },
    urgency: {
      type: String,
      required: [true, 'Urgency is required'],
    },
    dateNeededBy: {
      type: Date,
      required: [true, 'Date needed by is required'],
    },
    additionalInformation: {
      type: String,
      required: false,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const RequestResourceModel = model<RequestResourceSchema>('RequestResource', requestResourceSchema);

export { RequestResourceModel };
export type { RequestResourceSchema, RequestResourceKind, RequestResourceDocument };
