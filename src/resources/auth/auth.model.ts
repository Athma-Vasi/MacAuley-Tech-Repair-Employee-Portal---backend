import { model, Schema, Types } from "mongoose";

/**
 * - an auth session document with tokens array associated with a user.
 * - when a user logs out (or triggered by invalid token),
 *   the auth session document with its tokens family is deleted from the database.
 * - on every token refresh, the previous token is checked against the deny list.
 * - if it exists, then a 'replay attack' is detected and all session ids are deleted, triggering a logout for all devices.
 */
type AuthSchema = {
  expireAt: Date; // user will be required to log in their session again after 7 days - back up measure
  userId: Types.ObjectId;
  username: string;
  tokensDenyList: string[]; // will be the family of tokens jwtid created per session
};

type AuthDocument = AuthSchema & {
  _id: Types.ObjectId; // will be the sessionId in token payload
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

const authSchema = new Schema<AuthSchema>(
  {
    expireAt: {
      type: Date,
      default: Date.now,
      index: { expires: "7d" }, // 7 days
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, "User ID is required"],
      ref: "User",
      index: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    tokensDenyList: {
      type: [String],
      default: [],
      index: true,
    },
  },
  { timestamps: true },
);

authSchema.index({ username: "text" });

const AuthModel = model<AuthDocument>("Auth", authSchema);

export { AuthModel };
export type { AuthDocument, AuthSchema };
