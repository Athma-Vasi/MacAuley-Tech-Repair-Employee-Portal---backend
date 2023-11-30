import { Schema, Types, model } from "mongoose";

import type {
	DimensionUnit,
	MemoryUnit,
	ProductAvailability,
	ProductReview,
	WeightUnit,
	MobileOs,
	StarRatingsCount,
} from "../product.types";
import type { Currency } from "../../actions/company/expenseClaim";

type SmartphoneSchema = {
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
	smartphoneOs: MobileOs; // Android, iOS, etc.
	smartphoneChipset: string; // Snapdragon 888, Apple A14 Bionic, etc.
	smartphoneDisplay: number; // 6.7", 6.9", etc.
	smartphoneHorizontalResolution: number;
	smartphoneVerticalResolution: number;
	smartphoneRamCapacity: number; // 12, 16, etc.
	smartphoneRamCapacityUnit: MemoryUnit; // GB, etc.
	smartphoneStorage: number; // 128 GB, 256 GB, etc.
	smartphoneBattery: number; // 5000 mAh, 6000 mAh, etc.
	smartphoneCamera: string; // 108 MP, 64 MP, etc.
	smartphoneColor: string; // Black, White, etc.
	additionalFields: {
		[key: string]: string;
	};

	starRatingsCount: StarRatingsCount;
	reviewsIds: Types.ObjectId[];
	uploadedFilesIds: Types.ObjectId[];
};

type SmartphoneDocument = SmartphoneSchema & {
	_id: Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
	__v: number;
};

const smartphoneSchema = new Schema<SmartphoneSchema>(
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
		smartphoneOs: {
			type: String,
			required: [true, "OS is required"],
			index: true,
		},
		smartphoneChipset: {
			type: String,
			required: [true, "Chipset is required"],
		},
		smartphoneDisplay: {
			type: Number,
			required: [true, "Display is required"],
		},
		smartphoneHorizontalResolution: {
			type: Number,
			required: [true, "Horizontal resolution is required"],
		},
		smartphoneVerticalResolution: {
			type: Number,
			required: [true, "Vertical resolution is required"],
		},
		smartphoneRamCapacity: {
			type: Number,
			required: [true, "RAM is required"],
		},
		smartphoneRamCapacityUnit: {
			type: String,
			required: [true, "RAM unit is required"],
			index: true,
		},
		smartphoneStorage: {
			type: Number,
			required: [true, "Storage is required"],
		},
		smartphoneBattery: {
			type: Number,
			required: [true, "Battery is required"],
		},
		smartphoneCamera: {
			type: String,
			required: [true, "Camera is required"],
		},
		smartphoneColor: {
			type: String,
			required: [true, "Color is required"],
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
				"0.5": 0,
				"1.0": 0,
				"1.5": 0,
				"2.0": 0,
				"2.5": 0,
				"3.0": 0,
				"3.5": 0,
				"4.0": 0,
				"4.5": 0,
				"5.0": 0,
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
smartphoneSchema.index({
	brand: "text",
	model: "text",
	description: "text",
	additionalComments: "text",

	// smartphone
	smartphoneChipset: "text",
	smartphoneCamera: "text",
	smartphoneColor: "text",
});

const SmartphoneModel = model<SmartphoneDocument>(
	"Smartphone",
	smartphoneSchema,
);

export { SmartphoneModel };
export type { SmartphoneSchema, SmartphoneDocument };
