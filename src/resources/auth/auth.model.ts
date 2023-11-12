import { Schema, Types, model } from 'mongoose';

/**
 * - an auth session document with refresh tokens array that are associated with a user.
 * - when a user logs out (or triggered by expired refresh token), the auth session document with its refresh tokens family is deleted from the database
 * - on every refresh token rotation, the previous refresh token is checked against the deny list. If it exists, then a 'replay attack' is detected and all session ids are deleted, triggering a logout for all devices.
 */
type AuthSchema = {
  expireAt: Date; // user will be required to log in their session again after 1 day - back up measure, as any expired refresh tokens will trigger a logout and deletion of current session document
  userId: Types.ObjectId;
  username: string;
  refreshTokensDenyList: string[]; // will be the family of refresh tokens jwtid created per session
};

type AuthDocument = AuthSchema & {
  _id: Types.ObjectId; // will be the sessionId in refresh token payload
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

const authSchema = new Schema<AuthSchema>(
  {
    expireAt: {
      type: Date,
      default: Date.now,
      index: { expires: '1d' },
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, 'User ID is required'],
      ref: 'User',
      index: true,
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
    },
    refreshTokensDenyList: {
      type: [String],
      default: [],
      index: true,
    },
  },
  { timestamps: true }
);

authSchema.index({ username: 'text' });

const AuthModel = model<AuthDocument>('Auth', authSchema);

export { AuthModel };
export type { AuthDocument, AuthSchema };
