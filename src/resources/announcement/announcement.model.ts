import mongoose, { Schema, model, Types } from 'mongoose';

type RatingFeel = 'estatic' | 'happy' | 'neutral' | 'sad' | 'devastated' | '';

type ArticleSections = 'title' | 'body';

type AnnouncementSchema = {
  user: Types.ObjectId;
  title: string;
  username: string;
  imageSrc: string;
  imageAlt: string;
  article: Record<ArticleSections, string[]>;
  timeToRead: number;
  rating: {
    feel: RatingFeel;
    count: number;
  };
};

type AnnouncementDocument = AnnouncementSchema & {
  _id: Types.ObjectId;
  createdAt: NativeDate;
  updatedAt: NativeDate;
  __v: number;
};

const announcementSchema = new Schema<AnnouncementSchema>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User is required'],
      ref: 'User', // referring to the User model
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
    },
    imageSrc: {
      type: String,
      required: [true, 'ImageSrc is required'],
    },
    imageAlt: {
      type: String,
      required: [true, 'ImageAlt is required'],
    },
    article: {
      type: Object,
      required: [true, 'Article is required'],
    },
    timeToRead: {
      type: Number,
      required: [true, 'TimeToRead is required'],
    },
    rating: {
      type: Object,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const AnnouncementModel = model('Announcement', announcementSchema);

export { AnnouncementModel };
export type { AnnouncementSchema, AnnouncementDocument, RatingFeel, ArticleSections };
