import { Schema, model, Types } from 'mongoose';

type UserRoles = ('Admin' | 'Employee' | 'Manager')[];

type UserSchema = {
  email: string;
  username: string;
  password: string;
  roles: UserRoles;
  active: boolean;
};

type UserDocument = UserSchema & {
  _id: Types.ObjectId;
  createdAt: NativeDate;
  updatedAt: NativeDate;
  __v: number;
};

const userSchema = new Schema<UserSchema>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      index: true,
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    roles: [
      {
        type: String,
        enum: ['Admin', 'Employee', 'Manager'],
        default: 'Employee',
      },
    ],
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = model('User', userSchema);

export { UserModel };
export type { UserSchema, UserDocument, UserRoles };