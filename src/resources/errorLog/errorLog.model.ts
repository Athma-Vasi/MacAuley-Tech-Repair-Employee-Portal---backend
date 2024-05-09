import { Schema, Types, model } from "mongoose";

type ErrorLogSchema = {
  userId: string;
  username: string;
  sessionId: string;
  message: string;
  stack: string;
  requestBody: string;
  status: number;
  timestamp: Date;
};

type ErrorLogDocument = ErrorLogSchema & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

const errorLogSchema = new Schema<ErrorLogSchema>(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      ref: "User",
      unique: true,
      index: true,
    },
    username: {
      type: String,
      required: false,
      default: "Username was not provided",
    },
    sessionId: {
      type: String,
      required: false,
      default: "Session ID was not provided",
      index: true,
    },
    message: {
      type: String,
      required: false,
      default: "Message was not provided",
    },
    stack: {
      type: String,
      required: false,
      default: "Stack trace was not provided",
    },
    requestBody: {
      type: String,
      required: false,
      default: "Request body was not provided",
    },
    status: {
      type: Number,
      required: false,
      default: 500,
    },
    timestamp: {
      type: Date,
      required: false,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

errorLogSchema.index({
  username: "text",
  sessionId: "text",
  message: "text",
  stack: "text",
  requestBody: "text",
});

const ErrorLogModel = model<ErrorLogDocument>("ErrorLog", errorLogSchema);

export { ErrorLogModel, ErrorLogSchema, ErrorLogDocument };
