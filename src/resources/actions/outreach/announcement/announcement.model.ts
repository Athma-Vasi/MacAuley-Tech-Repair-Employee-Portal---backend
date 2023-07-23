import { Schema, model, Types } from 'mongoose';
import type { Action } from '../../../actions';
import type { ActionsOutreach } from '../../outreach';

type RatingFeel = 'estatic' | 'happy' | 'neutral' | 'sad' | 'devastated' | '';

type ArticleSections = 'title' | 'body';

type AnnouncementSchema = {
  userId: Types.ObjectId;
  username: string;
  action: Action;
  category: ActionsOutreach;
  title: string;
  bannerImageSrc: string;
  bannerImageAlt: string;
  article: Record<ArticleSections, string[]>;
  timeToRead: number;
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
      ref: 'User', // referring to the User model
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
      type: Object,
      required: [true, 'Article is required'],
    },
    timeToRead: {
      type: Number,
      required: [true, 'TimeToRead is required'],
    },
  },
  {
    timestamps: true,
  }
);

const AnnouncementModel = model<AnnouncementDocument>('Announcement', announcementSchema);

export { AnnouncementModel };
export type { AnnouncementSchema, AnnouncementDocument, RatingFeel, ArticleSections };