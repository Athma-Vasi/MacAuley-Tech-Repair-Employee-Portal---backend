import { Schema, Types, model } from "mongoose";

import type {
	DimensionUnit,
	ProductAvailability,
	ProductReview,
	StarRatingsCount,
	WebcamFrameRate,
	WebcamInterface,
	WebcamMicrophone,
	WebcamResolution,
	WeightUnit,
} from "../product.types";
import type { Currency } from "../../actions/company/expenseClaim";

type WebcamSchema = {
	// page 1
	sku: string;
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
	webcamResolution: WebcamResolution; // 720p, 1080p, etc.
	webcamInterface: WebcamInterface; // USB, Bluetooth, etc.
	webcamMicrophone: WebcamMicrophone; // Yes, No
	webcamFrameRate: WebcamFrameRate; // 30 fps, 60 fps, etc.
	webcamColor: string; // Black, White, etc.
	additionalFields: {
		[key: string]: string;
	};

	starRatingsCount: StarRatingsCount;
	reviewsIds: Types.ObjectId[];
	uploadedFilesIds: Types.ObjectId[];
};

type WebcamDocument = WebcamSchema & {
	_id: Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
	__v: number;
};

const webcamSchema = new Schema<WebcamSchema>(
	{
		// page 1
		sku: {
			type: String,
			required: [true, "SKU is required"],
			unique: true,
			index: true,
		},
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
		webcamResolution: {
			type: String,
			required: [true, "Webcam resolution is required"],
			index: true,
		},
		webcamInterface: {
			type: String,
			required: [true, "Webcam interface is required"],
			index: true,
		},
		webcamMicrophone: {
			type: String,
			required: [true, "Webcam microphone is required"],
			index: true,
		},
		webcamFrameRate: {
			type: String,
			required: [true, "Webcam frame rate is required"],
			index: true,
		},
		webcamColor: {
			type: String,
			required: [true, "Webcam color is required"],
		},
		// user defined fields
		additionalFields: {
			type: Object,
			required: false,
			default: {},
		},

		starRatingsCount: {
			"0.5": {
				type: Number,
				required: false,
				default: 0,
				index: true,
			},
			"1": {
				type: Number,
				required: false,
				default: 0,
				index: true,
			},
			"1.5": {
				type: Number,
				required: false,
				default: 0,
				index: true,
			},
			"2": {
				type: Number,
				required: false,
				default: 0,
				index: true,
			},
			"2.5": {
				type: Number,
				required: false,
				default: 0,
				index: true,
			},
			"3": {
				type: Number,
				required: false,
				default: 0,
				index: true,
			},
			"3.5": {
				type: Number,
				required: false,
				default: 0,
				index: true,
			},
			"4": {
				type: Number,
				required: false,
				default: 0,
				index: true,
			},
			"4.5": {
				type: Number,
				required: false,
				default: 0,
				index: true,
			},
			"5": {
				type: Number,
				required: false,
				default: 0,
				index: true,
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
webcamSchema.index({
	brand: "text",
	model: "text",
	description: "text",
	additionalComments: "text",

	// webcam
	webcamColor: "text",
});

const WebcamModel = model<WebcamDocument>("Webcam", webcamSchema);

export { WebcamModel };
export type { WebcamDocument, WebcamSchema };
