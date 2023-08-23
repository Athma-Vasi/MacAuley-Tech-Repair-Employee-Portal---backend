import { Schema, model, Types } from 'mongoose';
import type { Action } from '../../../actions';
import type { ActionsOutreach } from '../../outreach';

type RatingEmotion = {
  estatic: number;
  happy: number;
  neutral: number;
  annoyed: number;
  devastated: number;
};

type RatingResponse = {
  ratingEmotion: RatingEmotion;
  ratingCount: number;
};

type AnnouncementSchema = {
  userId: Types.ObjectId;
  username: string;
  action: Action;
  category: ActionsOutreach;
  title: string;
  author: string;
  bannerImageSrc: string;
  bannerImageAlt: string;
  article: string[];
  timeToRead: number;
  ratingResponse: RatingResponse;
  ratedUserIds: Types.ObjectId[];
};

type AnnouncementDocument = AnnouncementSchema & {
  _id: Types.ObjectId;
  createdAt: NativeDate;
  updatedAt: NativeDate;
  __v: number;
};

const announcementSchema = new Schema<AnnouncementSchema>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, 'User is required'],
      ref: 'User',
      index: true,
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
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

    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
    },
    bannerImageSrc: {
      type: String,
      required: false,
      default: '',
    },
    bannerImageAlt: {
      type: String,
      required: false,
      default: '',
    },
    article: {
      type: [String],
      required: [true, 'Article is required'],
    },
    timeToRead: {
      type: Number,
      required: [true, 'TimeToRead is required'],
    },
    ratingResponse: {
      type: Object,
      required: false,
      default: {
        ratingEmotion: {
          estatic: 0,
          happy: 0,
          neutral: 0,
          annoyed: 0,
          devastated: 0,
        },
        ratingCount: 0,
      },
    },
    ratedUserIds: {
      type: [Schema.Types.ObjectId],
      required: false,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const AnnouncementModel = model<AnnouncementDocument>('Announcement', announcementSchema);

export { AnnouncementModel };
export type { AnnouncementSchema, AnnouncementDocument, RatingEmotion, RatingResponse };
