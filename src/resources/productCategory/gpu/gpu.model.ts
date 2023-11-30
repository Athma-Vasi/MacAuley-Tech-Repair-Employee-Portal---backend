import { Schema, Types, model } from "mongoose";
import type {
	DimensionUnit,
	ProductAvailability,
	MemoryUnit,
	ProductReview,
	WeightUnit,
	StarRatingsCount,
} from "../product.types";
import type { Currency } from "../../actions/company/expenseClaim";

type GpuSchema = {
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
	gpuChipset: string; // NVIDIA GeForce RTX 3080,
	gpuMemory: number; // 10 GB, 16 GB, etc.
	gpuMemoryUnit: MemoryUnit; // GB, etc.
	gpuCoreClock: number; // 1440 MHz, 1770 MHz, etc.
	gpuBoostClock: number; // 1710 MHz, 2250 MHz, etc.
	gpuTdp: number; // 320 W, 350 W, etc.
	additionalFields: {
		[key: string]: string;
	};

	starRatingsCount: StarRatingsCount;
	reviewsIds: Types.ObjectId[];
	uploadedFilesIds: Types.ObjectId[];
};

type GpuDocument = GpuSchema & {
	_id: Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
	__v: number;
};

const gpuSchema = new Schema<GpuSchema>(
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
		gpuChipset: {
			type: String,
			required: [true, "Chipset is required"],
		},
		gpuMemory: {
			type: Number,
			required: [true, "Memory is required"],
		},
		gpuMemoryUnit: {
			type: String,
			required: [true, "Memory unit is required"],
			index: true,
		},
		gpuCoreClock: {
			type: Number,
			required: [true, "Core clock is required"],
		},
		gpuBoostClock: {
			type: Number,
			required: [true, "Boost clock is required"],
		},
		gpuTdp: {
			type: Number,
			required: [true, "TDP is required"],
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
gpuSchema.index({
	brand: "text",
	model: "text",
	description: "text",
	additionalComments: "text",

	// gpu
	gpuChipset: "text",
});

const GpuModel = model<GpuDocument>("GPU", gpuSchema);

export type { GpuDocument, GpuSchema };
export { GpuModel };
