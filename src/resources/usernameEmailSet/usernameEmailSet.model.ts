import { Schema, Types, model } from "mongoose";

/**
 * - Used for determining uniqueness of username or email (upon registration)
 * - All usernames and emails are stored here after successful registration
 */
type UsernameEmailSetSchema = {
  username: string[];
  email: string[];
};

type UsernameEmailSetDocument = UsernameEmailSetSchema & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

const usernameEmailSetSchema = new Schema<UsernameEmailSetSchema>(
  {
    username: {
      type: [String],
      required: [true, "Username is required"],
      index: true,
    },
    email: {
      type: [String],
      required: [true, "Email is required"],
      index: true,
    },
  },
  { timestamps: true }
);

const UsernameEmailSetModel = model<UsernameEmailSetDocument>(
  "UsernameEmailSet",
  usernameEmailSetSchema
);

export { UsernameEmailSetModel };
export type { UsernameEmailSetSchema, UsernameEmailSetDocument };
