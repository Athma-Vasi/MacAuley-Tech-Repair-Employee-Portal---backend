import { Schema, model, Types } from 'mongoose';
import { JobPosition, PhoneNumber } from '../../../user';
import { Action } from '../../../actions';
import { ActionsGeneral } from '../../general';
import { RequestStatus } from '../../../../types';

type RefermentSchema = {
  referrerUserId: Types.ObjectId;
  referrerUsername: string;
  action: Action;
  category: ActionsGeneral;

  candidateFullName: string;
  candidateEmail: string;
  candidateContactNumber: PhoneNumber;
  candidateCurrentJobTitle: string;
  candidateCurrentCompany: string;
  candidateProfileUrl: string;

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

const refermentSchema = new Schema<RefermentSchema>({
  referrerUserId: {
    type: Schema.Types.ObjectId,
    required: [true, 'ReferrerUserId is required'],
    ref: 'User', // referring to the User model
    index: true,
  },
  referrerUsername: {
    type: String,
    required: [true, 'ReferrerUsername is required'],
    index: true,
  },
  action: {
    type: String,
    required: [true, 'Action is required'],
    enum: ['company', 'general', 'outreach'],
    index: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['endorsement', 'printer issue', 'anonymous request', 'referment'],
    index: true,
  },
  candidateFullName: {
    type: String,
    required: [true, 'CandidateFullName is required'],
  },
  candidateEmail: {
    type: String,
    required: [true, 'CandidateEmail is required'],
  },
  candidateContactNumber: {
    type: String,
    required: [true, 'CandidateContactNumber is required'],
  },
  candidateCurrentJobTitle: {
    type: String,
    required: [true, 'CandidateCurrentJobTitle is required'],
  },
  candidateCurrentCompany: {
    type: String,
    required: [true, 'CandidateCurrentCompany is required'],
  },
  candidateProfileUrl: {
    type: String,
    required: false,
    default: '',
  },
  positionReferredFor: {
    type: String,
    required: [true, 'PositionReferredFor is required'],
  },
  positionJobDescription: {
    type: String,
    required: false,
    default: '',
  },
  referralReason: {
    type: String,
    required: [true, 'ReferralReason is required'],
  },
  additionalInformation: {
    type: String,
    required: false,
    default: '',
  },
  privacyConsent: {
    type: Boolean,
    required: [true, 'PrivacyConsent is required'],
  },
  requestStatus: {
    type: String,
    required: false,
    default: 'pending',
    index: true,
  },
});

const RefermentModel = model<RefermentDocument>('Referment', refermentSchema);

export { RefermentModel };
export type { RefermentSchema, RefermentDocument };
