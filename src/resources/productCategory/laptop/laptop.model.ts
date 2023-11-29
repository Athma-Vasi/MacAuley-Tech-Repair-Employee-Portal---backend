import { Schema, Types, model } from "mongoose";

import type {
	DimensionUnit,
	MemoryUnit,
	ProductAvailability,
	ProductReview,
	WeightUnit,
	MemoryType,
	StorageType,
	StorageFormFactor,
	StorageInterface,
	DisplayPanelType,
	StarRatingsCount,
} from "../product.types";
import type { Currency } from "../../actions/company/expenseClaim";

type LaptopSchema = {
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

	// page 2 -> cpu
	cpuSocket: string; // LGA 1200, AM4, etc.
	cpuFrequency: number; // 3.6 GHz, 4.2 GHz, etc.
	cpuCores: number; // 6 cores, 8 cores, etc.
	cpuL1Cache: number; // 384, 512, etc.
	cpuL1CacheUnit: MemoryUnit; // KB, etc.
	cpuL2Cache: number; // 1.5, 2, etc.
	cpuL2CacheUnit: MemoryUnit; // MB, etc.
	cpuL3Cache: number; // 12, 16, etc.
	cpuL3CacheUnit: MemoryUnit; // MB, etc.
	cpuWattage: number; // 65 W, 95 W, etc.

	// page 2 -> gpu
	gpuChipset: string; // NVIDIA GeForce RTX 3080,
	gpuMemory: number; // 10 GB, 16 GB, etc.
	gpuMemoryUnit: MemoryUnit; // GB, etc.
	gpuCoreClock: number; // 1440 MHz, 1770 MHz, etc.
	gpuBoostClock: number; // 1710 MHz, 2250 MHz, etc.
	gpuTdp: number; // 320 W, 350 W, etc.

	// page 2 -> ram
	ramDataRate: number; // 3200 MT/s, 3600 MT/s, etc.
	ramModulesQuantity: number;
	ramModulesCapacity: number;
	ramModulesCapacityUnit: MemoryUnit; // GB, etc.
	ramType: MemoryType; // DDR4, etc.
	ramColor: string; // Black, White, etc.
	ramVoltage: number; // 1.35 V, etc.
	ramTiming: string; // 16-18-18-38, etc.

	// page 2 -> storage
	storageType: StorageType; // SSD, HDD, etc.
	storageCapacity: number; // 1, 2, etc.
	storageCapacityUnit: MemoryUnit; // TB, etc.
	storageCache: number; // 64 MB, 128 MB, etc.
	storageCacheUnit: MemoryUnit; // MB, etc.
	storageFormFactor: StorageFormFactor; // 2.5", M.2 2280, etc.
	storageInterface: StorageInterface; // SATA III, PCIe 3.0 x4, etc.

	// page 2 -> display
	displaySize: number; // 24", 27", etc.
	displayHorizontalResolution: number;
	displayVerticalResolution: number;
	displayRefreshRate: number; // 144 Hz, 165 Hz, etc.
	displayPanelType: DisplayPanelType; // IPS, TN, etc.
	displayResponseTime: number; // 1 ms, 4 ms, etc.
	displayAspectRatio: string; // 16:9, 21:9, etc.

	additionalFields: {
		[key: string]: string;
	};

	starRatingsCount: StarRatingsCount;
	reviewsIds: Types.ObjectId[];
	uploadedFilesIds: Types.ObjectId[];
};

type LaptopDocument = LaptopSchema & {
	_id: Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
	__v: number;
};

const laptopSchema = new Schema<LaptopSchema>(
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

		// page 2 -> cpu
		cpuSocket: {
			type: String,
			required: [true, "Socket is required"],
		},
		cpuFrequency: {
			type: Number,
			required: [true, "Speed is required"],
		},
		cpuCores: {
			type: Number,
			required: [true, "Cores is required"],
		},
		cpuL1Cache: {
			type: Number,
			required: [true, "Cache is required"],
		},
		cpuL1CacheUnit: {
			type: String,
			required: [true, "Cache unit is required"],
			index: true,
		},
		cpuL2Cache: {
			type: Number,
			required: [true, "Cache is required"],
		},
		cpuL2CacheUnit: {
			type: String,
			required: [true, "Cache unit is required"],
			index: true,
		},
		cpuL3Cache: {
			type: Number,
			required: [true, "Cache is required"],
		},
		cpuL3CacheUnit: {
			type: String,
			required: [true, "Cache unit is required"],
			index: true,
		},
		cpuWattage: {
			type: Number,
			required: [true, "Wattage is required"],
		},

		// page 2 -> gpu
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

		// page 2 -> ram
		ramDataRate: {
			type: Number,
			required: [true, "Speed is required"],
		},
		ramModulesQuantity: {
			type: Number,
			required: [true, "Modules quantity is required"],
		},
		ramModulesCapacity: {
			type: Number,
			required: [true, "Modules capacity is required"],
		},
		ramModulesCapacityUnit: {
			type: String,
			required: [true, "Modules capacity unit is required"],
			index: true,
		},
		ramType: {
			type: String,
			required: [true, "RAM type is required"],
			index: true,
		},
		ramColor: {
			type: String,
			required: [true, "Color is required"],
			index: true,
		},
		ramVoltage: {
			type: Number,
			required: [true, "Voltage is required"],
		},
		ramTiming: {
			type: String,
			required: [true, "Timing is required"],
		},

		// page 2 -> storage
		storageType: {
			type: String,
			required: [true, "Storage type is required"],
			index: true,
		},
		storageCapacity: {
			type: Number,
			required: [true, "Capacity is required"],
		},
		storageCapacityUnit: {
			type: String,
			required: [true, "Capacity unit is required"],
		},
		storageCache: {
			type: Number,
			required: [true, "Cache is required"],
		},
		storageCacheUnit: {
			type: String,
			required: [true, "Cache unit is required"],
		},
		storageFormFactor: {
			type: String,
			required: [true, "Form factor is required"],
			index: true,
		},
		storageInterface: {
			type: String,
			required: [true, "Interface is required"],
			index: true,
		},

		// page 2 -> display
		displaySize: {
			type: Number,
			required: [true, "Size is required"],
		},
		displayHorizontalResolution: {
			type: Number,
			required: [true, "Horizontal resolution is required"],
		},
		displayVerticalResolution: {
			type: Number,
			required: [true, "Vertical resolution is required"],
		},
		displayRefreshRate: {
			type: Number,
			required: [true, "Refresh rate is required"],
		},
		displayPanelType: {
			type: String,
			required: [true, "Panel type is required"],
			index: true,
		},
		displayResponseTime: {
			type: Number,
			required: [true, "Response time is required"],
		},
		displayAspectRatio: {
			type: String,
			required: [true, "Aspect ratio is required"],
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
laptopSchema.index({
	brand: "text",
	model: "text",
	description: "text",
	additionalComments: "text",

	// cpu
	cpuSocket: "text",
	// gpu
	gpuChipset: "text",
	// ram
	ramColor: "text",
	// display
	displayAspectRatio: "text",
});

const LaptopModel = model<LaptopDocument>("Laptop", laptopSchema);

export { LaptopModel };
export type { LaptopSchema, LaptopDocument };
