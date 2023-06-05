import { Schema, model } from 'mongoose';

type UserSchema = {
  username: string;
  password: string;
  roles: ('Admin' | 'Employee' | 'Manager')[];
  active: boolean;
};

type UserDocument = UserSchema & {
  _id: Schema.Types.ObjectId;
  createdAt: NativeDate;
  updatedAt: NativeDate;
  __v: number;
};

const userSchema = new Schema<UserSchema>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
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

export { UserModel, UserDocument, UserSchema };
