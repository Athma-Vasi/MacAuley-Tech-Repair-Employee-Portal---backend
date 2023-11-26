import { Schema, Types, model } from 'mongoose';
import { PreferredPronouns, PhoneNumber } from '../../../user';
import { Address } from '../../../user/user.model';

type PaymentInformation = {
  cardholderName: string;
  cardNumber: string;
  expirationDate: string;
  cvv: string;
  billingAddress: Address;
};

type CustomerSchema = {
  username: string;
  password: string;
  email: string;

  firstName: string;
  middleName: string;
  lastName: string;
  preferredName: string;
  preferredPronouns: PreferredPronouns;
  profilePictureUrl: string;
  dateOfBirth: NativeDate;

  contactNumber: PhoneNumber;
  address: Address;
  paymentInformation: PaymentInformation;
  purchaseHistoryIds: (Types.ObjectId | string)[];
  rmaHistoryIds: (Types.ObjectId | string)[];

  isActive: boolean;
  completedSurveys: (Types.ObjectId | string)[];
  isPrefersReducedMotion: boolean;
};

type CustomerDocument = CustomerSchema & {
  _id: Types.ObjectId;
  createdAt: NativeDate;
  updatedAt: NativeDate;
  __v: number;
};

const customerSchema = new Schema<CustomerSchema>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      index: true,
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
    },
    middleName: {
      type: String,
      required: false,
      default: '',
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
    },
    preferredName: {
      type: String,
      required: false,
      default: '',
    },
    preferredPronouns: {
      type: String,
      required: false,
      default: 'Prefer not to say',
      index: true,
    },
    profilePictureUrl: {
      type: String,
      required: false,
      default: '',
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },

    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
    },
    address: {
      addressLine: {
        type: String,
        required: [true, 'Address line 1 is required'],
      },
      city: {
        type: String,
        required: [true, 'City is required'],
      },
      province: {
        type: String,
        required: false,
        index: true,
      },
      state: {
        type: String,
        required: false,
        index: true,
      },
      postalCode: {
        type: String,
        required: [true, 'Postal code is required'],
      },
      country: {
        type: String,
        required: [true, 'Country is required'],
        index: true,
      },
    },

    paymentInformation: {
      cardholderName: {
        type: String,
        required: [true, 'Cardholder name is required'],
      },
      cardNumber: {
        type: String,
        required: [true, 'Card number is required'],
      },
      expirationDate: {
        type: String,
        required: [true, 'Expiration date is required'],
      },
      cvv: {
        type: String,
        required: [true, 'CVV is required'],
      },
      billingAddress: {
        addressLine: {
          type: String,
          required: [true, 'Address line 1 is required'],
        },
        city: {
          type: String,
          required: [true, 'City is required'],
        },
        province: {
          type: String,
          required: false,
          index: true,
        },
        state: {
          type: String,
          required: false,
          index: true,
        },
        postalCode: {
          type: String,
          required: [true, 'Postal code is required'],
        },
        country: {
          type: String,
          required: [true, 'Country is required'],
          index: true,
        },
      },
    },

    purchaseHistoryIds: [
      {
        type: [Schema.Types.ObjectId],
        required: false,
        default: [],
        ref: 'Purchase',
        index: true,
      },
    ],

    rmaHistoryIds: [
      {
        type: [Schema.Types.ObjectId],
        required: false,
        default: [],
        ref: 'ReturnMerchandiseAuthorization',
        index: true,
      },
    ],

    isActive: {
      type: Boolean,
      required: false,
      default: true,
    },

    completedSurveys: [
      {
        type: [Schema.Types.ObjectId],
        required: false,
        default: [],
        ref: 'SurveyBuilder',
        index: true,
      },
    ],

    isPrefersReducedMotion: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  { timestamps: true }
);

// text indexes for searching all user entered text input fields
customerSchema.index({
  username: 'text',
  email: 'text',
  firstName: 'text',
  middleName: 'text',
  lastName: 'text',
  preferredName: 'text',
  contactNumber: 'text',
  'address.addressLine': 'text',
  'address.city': 'text',
  'address.postalCode': 'text',
});

const CustomerModel = model<CustomerDocument>('Customer', customerSchema);

export { CustomerModel };
export type { CustomerSchema, CustomerDocument, PaymentInformation };
