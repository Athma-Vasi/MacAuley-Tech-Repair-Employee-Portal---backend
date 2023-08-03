import { Schema, Types, model } from 'mongoose';
import type { UserRoles } from '../../../user';
import type { Action } from '../../../actions';
import type { ActionsOutreach } from '../../../actions/outreach';

type EventKind =
  | 'Webinar'
  | 'Workshop'
  | 'Seminar'
  | 'Conference'
  | 'Networking'
  | 'Tech Talk'
  | 'Charity'
  | 'Team Building'
  | 'Awards'
  | 'Other';

type EventCreatorSchema = {
  userId: Types.ObjectId;
  username: string;
  creatorRole: UserRoles;
  action: Action;
  category: ActionsOutreach;

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

type EventCreatorDocument = EventCreatorSchema & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

const eventCreatorSchema = new Schema<EventCreatorSchema>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, 'User ID is required'],
      ref: 'User',
      index: true,
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      index: true,
    },
    creatorRole: {
      type: [String],
      required: [true, 'User role is required'],
    },
    action: {
      type: String,
      required: [true, 'Action is required'],
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      index: true,
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
    eventStartDate: {
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
      required: false,
      default: '',
    },
    requiredItems: {
      type: String,
      required: false,
      default: '',
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
