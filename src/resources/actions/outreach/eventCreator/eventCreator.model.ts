import { Schema, Types, model } from 'mongoose';
import type { UserRoles } from '../../../user';

type EventKind =
  | 'Webinar'
  | 'Workshop'
  | 'Seminar'
  | 'Conference'
  | 'Charity'
  | 'Team Building'
  | 'Awards'
  | 'Other';

type EventCreatorSchema = {
  creatorId: Types.ObjectId;
  creatorUsername: string;
  creatorRole: UserRoles;
  eventTitle: string;
  eventDescription: string;
  eventKind: EventKind;
  eventDate: NativeDate;
  eventStartTime: string;
  eventEndTime: string;
  eventLocation: string;
  eventAttendees: string;
  requiredItems: string;
  rsvpDeadline: NativeDate;
};

type EventCreatorDocument = EventCreatorSchema & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

const eventCreatorSchema = new Schema<EventCreatorSchema>(
  {
    creatorId: {
      type: Schema.Types.ObjectId,
      required: [true, 'User ID is required'],
      ref: 'User',
      index: true,
    },
    creatorUsername: {
      type: String,
      required: [true, 'Username is required'],
      index: true,
    },
    creatorRole: {
      type: [String],
      required: [true, 'User role is required'],
    },
    eventTitle: {
      type: String,
      required: [true, 'Event title is required'],
    },
    eventDescription: {
      type: String,
      required: [true, 'Event description is required'],
    },
    eventKind: {
      type: String,
      required: [true, 'Event kind is required'],
    },
    eventDate: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    eventStartTime: {
      type: String,
      required: [true, 'Event start time is required'],
    },
    eventEndTime: {
      type: String,
      required: [true, 'Event end time is required'],
    },
    eventLocation: {
      type: String,
      required: [true, 'Event location is required'],
    },
    eventAttendees: {
      type: String,
      required: [true, 'Event attendees is required'],
    },
    requiredItems: {
      type: String,
      required: [true, 'Required items is required'],
    },
    rsvpDeadline: {
      type: Date,
      required: [true, 'RSVP deadline is required'],
    },
  },
  {
    timestamps: true,
  }
);

const EventCreatorModel = model<EventCreatorDocument>('EventCreator', eventCreatorSchema);

export { EventCreatorModel };
export type { EventCreatorSchema, EventCreatorDocument, EventKind };
