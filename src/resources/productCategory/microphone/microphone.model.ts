import { Schema, Types, model } from "mongoose";

import type {
	DimensionUnit,
	MicrophoneInterface,
	MicrophonePolarPattern,
	MicrophoneType,
	ProductAvailability,
	ProductReview,
	WeightUnit,
} from "../product.types";
import type { Currency } from "../../actions/company/expenseClaim";

type MicrophoneSchema = {
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
	microphoneType: MicrophoneType; // Condenser, Dynamic, etc.
	microphonePolarPattern: MicrophonePolarPattern; // Cardioid, etc.
	microphoneFrequencyResponse: string; // 20Hz-20kHz, etc.
	microphoneColor: string; // Black, White, etc.
	microphoneInterface: MicrophoneInterface; // XLR, USB, etc.
	additionalFields: {
		[key: string]: string;
	};

	// page 3
	reviewsIds: Types.ObjectId[];
	uploadedFilesIds: Types.ObjectId[];
};

type MicrophoneDocument = MicrophoneSchema & {
	_id: Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
	__v: number;
};

const microphoneSchema = new Schema<MicrophoneSchema>(
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
		microphoneType: {
			type: String,
			required: [true, "Microphone type is required"],
			index: true,
		},
		microphonePolarPattern: {
			type: String,
			required: [true, "Microphone polar pattern is required"],
			index: true,
		},
		microphoneFrequencyResponse: {
			type: String,
			required: [true, "Microphone frequency response is required"],
		},
		microphoneColor: {
			type: String,
			required: [true, "Microphone color is required"],
		},
		microphoneInterface: {
			type: String,
			required: [true, "Microphone interface is required"],
			index: true,
		},
		// user defined fields
		additionalFields: {
			type: Object,
			required: false,
			default: {},
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
microphoneSchema.index({
	brand: "text",
	model: "text",
	description: "text",
	additionalComments: "text",

	// webcam
	microphoneFrequencyResponse: "text",
	microphoneColor: "text",
});

const MicrophoneModel = model<MicrophoneDocument>(
	"Microphone",
	microphoneSchema,
);

export { MicrophoneModel };
export type { MicrophoneDocument, MicrophoneSchema };
