import { Schema, model, Types } from 'mongoose';

type RefermentSchema = {
  referrerUserId: Types.ObjectId;
  referrerUsername: string;

  candidateFullName: string;
  candidateEmail: string;
  candidateContactNumber: string;
  candidateCurrentJobTitle: string;
  candidateCurrentCompany: string;
  candidateLinkedinProfile: string;

  positionReferredFor: string;
  positionJobDescription: string;
  referralReason: string;
  additionalInformation: string;
  privacyConsent: boolean;
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
  candidateLinkedinProfile: {
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
});

const RefermentModel = model<RefermentDocument>('Referment', refermentSchema);

export { RefermentModel };
export type { RefermentSchema, RefermentDocument };
