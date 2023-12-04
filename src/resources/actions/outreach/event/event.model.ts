import { Schema, Types, model } from "mongoose";
import type { UserRoles } from "../../../user";
import type { Action } from "../..";
import type { ActionsOutreach } from "..";

type EventKind =
  | "Webinar"
  | "Workshop"
  | "Seminar"
  | "Conference"
  | "Networking"
  | "Tech Talk"
  | "Charity"
  | "Team Building"
  | "Awards"
  | "Other";

type EventSchema = {
  userId: Types.ObjectId;
  username: string;
  creatorRole: UserRoles;
  eventTitle: string;
  eventKind: EventKind;
  eventStartDate: NativeDate;
  eventEndDate: NativeDate;
  eventStartTime: string;
  eventEndTime: string;
  eventDescription: string;
  eventLocation: string;
  eventAttendees: string;
  requiredItems: string;
  rsvpDeadline: NativeDate;
};

type EventDocument = EventSchema & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

const eventSchema = new Schema<EventSchema>(
  {
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
    creatorRole: {
      type: [String],
      required: [true, "User role is required"],
    },
    eventTitle: {
      type: String,
      required: [true, "Event title is required"],
    },
    eventDescription: {
      type: String,
      required: [true, "Event description is required"],
    },
    eventKind: {
      type: String,
      required: [true, "Event kind is required"],
      index: true,
    },
    eventStartDate: {
      type: Date,
      required: [true, "Event date is required"],
    },
    eventEndDate: {
      type: Date,
      required: [true, "Event date is required"],
    },
    eventStartTime: {
      type: String,
      required: [true, "Event start time is required"],
    },
    eventEndTime: {
      type: String,
      required: [true, "Event end time is required"],
    },
    eventLocation: {
      type: String,
      required: [true, "Event location is required"],
    },
    eventAttendees: {
      type: String,
      required: false,
      default: "",
    },
    requiredItems: {
      type: String,
      required: false,
      default: "",
    },
    rsvpDeadline: {
      type: Date,
      required: [true, "RSVP deadline is required"],
    },
  },
  {
    timestamps: true,
  }
);

// text indexes for search
eventSchema.index({
  username: "text",
  eventTitle: "text",
  eventDescription: "text",
  eventLocation: "text",
  eventAttendees: "text",
  requiredItems: "text",
});

const EventModel = model<EventDocument>("Event", eventSchema);

export { EventModel };
export type { EventSchema, EventDocument, EventKind };
