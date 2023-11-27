import { Types, Schema, model } from 'mongoose';

type ProductRating = {
  rating: 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5;
  count: number;
};

type ProductReviewSchema = {
  userId: Types.ObjectId;
  username: string;
  productId: Types.ObjectId;
  productBrand: string;
  productModel: string;
  productReview: string;
  productRating: ProductRating;
  helpfulVotes: number;
  isVerifiedPurchase: boolean;
};

type ProductReviewDocument = ProductReviewSchema & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

const productReviewSchema = new Schema<ProductReviewSchema>(
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
    },

    productId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Product ID is required'],
      index: true,
    },
    productBrand: {
      type: String,
      required: [true, 'Product Brand is required'],
    },
    productModel: {
      type: String,
      required: [true, 'Product Model is required'],
    },
    productReview: {
      type: String,
      required: [true, 'Product Review is required'],
    },
    productRating: {
      rating: {
        type: Number,
        required: [true, 'Product Rating is required'],
      },
      count: {
        type: Number,
        required: [true, 'Product Rating Count is required'],
      },
      required: [true, 'Product Rating is required'],
    },
    helpfulVotes: {
      type: Number,
      required: [true, 'Helpful Votes is required'],
    },
    isVerifiedPurchase: {
      type: Boolean,
      required: [true, 'Is Verified Purchase is required'],
    },
  },
  { timestamps: true }
);

// text index for searching
productReviewSchema.index({
  username: 'text',
  productBrand: 'text',
  productModel: 'text',
  productReview: 'text',
});

const ProductReviewModel = model<ProductReviewDocument>('ProductReview', productReviewSchema);

export { ProductReviewModel };
export type { ProductReviewDocument, ProductReviewSchema, ProductRating };
