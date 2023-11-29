import { Schema, Types, model } from "mongoose";

import type {
	DimensionUnit,
	ProductAvailability,
	ProductReview,
	WeightUnit,
	PeripheralsInterface,
	KeyboardLayout,
	KeyboardSwitch,
	KeyboardBacklight,
	StarRatingsCount,
} from "../product.types";
import type { Currency } from "../../actions/company/expenseClaim";

type KeyboardSchema = {
	userId: Types.ObjectId;
	username: string;

	// page 1
	brand: string;
	model: string;
	description: string;
	price: number;
	currency: Currency;
	availability: ProductAvailability;
	quantity: number;
	weight: number;
	weightUnit: WeightUnit;
	length: number;
	lengthUnit: DimensionUnit;
	width: number;
	widthUnit: DimensionUnit;
	height: number;
	heightUnit: DimensionUnit;
	additionalComments: string;

	// page 2
	keyboardSwitch: KeyboardSwitch; // Cherry MX Red, Cherry MX Blue, etc.
	keyboardLayout: KeyboardLayout; // ANSI, ISO, etc.
	keyboardBacklight: KeyboardBacklight; // RGB, etc.
	keyboardInterface: PeripheralsInterface; // USB, Bluetooth, etc.
	additionalFields: {
		[key: string]: string;
	};

	starRatingsCount: StarRatingsCount;
	reviewsIds: Types.ObjectId[];
	uploadedFilesIds: Types.ObjectId[];
};

type KeyboardDocument = KeyboardSchema & {
	_id: Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
	__v: number;
};

const keyboardSchema = new Schema<KeyboardSchema>(
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

		// page 1
		brand: {
			type: String,
			required: [true, "Brand is required"],
		},
		model: {
			type: String,
			required: [true, "Model is required"],
		},
		description: {
			type: String,
			required: [true, "Description is required"],
		},
		price: {
			type: Number,
			required: [true, "Price is required"],
		},
		currency: {
			type: String,
			required: [true, "Currency is required"],
			index: true,
		},
		availability: {
			type: String,
			required: [true, "Availability is required"],
			index: true,
		},
		quantity: {
			type: Number,
			required: [true, "Quantity is required"],
		},
		weight: {
			type: Number,
			required: [true, "Weight is required"],
		},
		weightUnit: {
			type: String,
			required: [true, "Weight unit is required"],
			index: true,
		},
		length: {
			type: Number,
			required: [true, "Length is required"],
		},
		lengthUnit: {
			type: String,
			required: [true, "Length unit is required"],
			index: true,
		},
		width: {
			type: Number,
			required: [true, "Width is required"],
		},
		widthUnit: {
			type: String,
			required: [true, "Width unit is required"],
			index: true,
		},
		height: {
			type: Number,
			required: [true, "Height is required"],
		},
		heightUnit: {
			type: String,
			required: [true, "Height unit is required"],
			index: true,
		},
		additionalComments: {
			type: String,
			required: false,
			default: "",
		},

		// page 2
		keyboardSwitch: {
			type: String,
			required: [true, "Switch is required"],
			index: true,
		},
		keyboardLayout: {
			type: String,
			required: [true, "Layout is required"],
			index: true,
		},
		keyboardBacklight: {
			type: String,
			required: [true, "Backlight is required"],
			index: true,
		},
		keyboardInterface: {
			type: String,
			required: [true, "Interface is required"],
			index: true,
		},
		// user defined fields
		additionalFields: {
			type: Object,
			required: false,
			default: {},
		},

		starRatingsCount: {
			type: Object,
			required: false,
			default: {
				halfStarRatings: 0,
				oneStarRatings: 0,
				oneHalfStarRatings: 0,
				twoStarRatings: 0,
				twoHalfStarRatings: 0,
				threeStarRatings: 0,
				threeHalfStarRatings: 0,
				fourStarRatings: 0,
				fourHalfStarRatings: 0,
				fiveStarRatings: 0,
			},
		},
		reviewsIds: {
			type: [Schema.Types.ObjectId],
			required: false,
			default: [],
			ref: "Review",
			index: true,
		},
		uploadedFilesIds: {
			type: [Schema.Types.ObjectId],
			required: false,
			default: [],
			ref: "FileUpload",
			index: true,
		},
	},
	{ timestamps: true },
);

// text indexes for searching all user entered text input fields
keyboardSchema.index({
	brand: "text",
	model: "text",
	description: "text",
	additionalComments: "text",
});

const KeyboardModel = model<KeyboardDocument>("Keyboard", keyboardSchema);

export { KeyboardModel };
export type {
	KeyboardDocument,
	KeyboardSchema,
	KeyboardSwitch,
	KeyboardLayout,
	KeyboardBacklight,
	PeripheralsInterface,
};