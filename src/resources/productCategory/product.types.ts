import { Types } from "mongoose";
import { FileUploadDocument } from "../fileUpload";

type ProductCategory =
	| "Accessory"
	| "Central Processing Unit (CPU)"
	| "Computer Case"
	| "Desktop Computer"
	| "Display"
	| "Graphics Processing Unit (GPU)"
	| "Headphone"
	| "Keyboard"
	| "Laptop"
	| "Memory (RAM)"
	| "Microphone"
	| "Motherboard"
	| "Mouse"
	| "Power Supply Unit (PSU)"
	| "Smartphone"
	| "Speaker"
	| "Storage"
	| "Tablet"
	| "Webcam";

type DimensionUnit = "mm" | "cm" | "m" | "in" | "ft";
type WeightUnit = "g" | "kg" | "lb";

type MemoryType = "DDR5" | "DDR4" | "DDR3" | "DDR2" | "DDR";
type MemoryUnit = "KB" | "MB" | "GB" | "TB";

type PeripheralsInterface = "USB" | "Bluetooth" | "PS/2" | "Wi-Fi" | "Other";

type MobileOs = "Android" | "iOS" | "Windows" | "Linux" | "Other";

type ProductAvailability =
	| "In Stock"
	| "Out of Stock"
	| "Pre-order"
	| "Discontinued"
	| "Other";

type ProductReview = {
	userId: Types.ObjectId;
	username: string;
	rating: number;
	review: string;
};

type MotherboardFormFactor =
	| "ATX"
	| "Micro ATX"
	| "Mini ITX"
	| "E-ATX"
	| "XL-ATX";

type StorageType = "SSD" | "HDD" | "SSHD" | "Other";
type StorageFormFactor =
	| '2.5"'
	| '3.5"'
	| "M.2 2280"
	| "M.2 22110"
	| "M.2 2242"
	| "M.2 2230"
	| "mSATA"
	| "U.2"
	| "Other";
type StorageInterface =
	| "SATA III"
	| "NVMe"
	| "PCIe"
	| "U.2"
	| "SATA-Express"
	| "M.2"
	| "mSATA"
	| "Other";

type PsuEfficiency =
	| "80+"
	| "80+ Bronze"
	| "80+ Silver"
	| "80+ Gold"
	| "80+ Platinum"
	| "80+ Titanium";
type PsuModularity = "Full" | "Semi" | "None" | "Other";
type PsuFormFactor = "ATX" | "SFX" | "SFX-L" | "TFX" | "Flex ATX" | "Other";

type CaseType =
	| "Mid Tower"
	| "Full Tower"
	| "Mini Tower"
	| "Cube"
	| "Slim"
	| "Desktop"
	| "Other";
type CaseSidePanel = "Windowed" | "Solid";

type DisplayPanelType = "IPS" | "TN" | "VA" | "OLED" | "QLED" | "Other";

type KeyboardSwitch =
	| "Cherry MX Red"
	| "Cherry MX Blue"
	| "Cherry MX Brown"
	| "Cherry MX Silent Red"
	| "Cherry MX Black"
	| "Cherry MX Clear"
	| "Membrane"
	| "Other";
type KeyboardLayout =
	| "QWERTY"
	| "HHKB"
	| "Dvorak"
	| "Colemak"
	| "Workman"
	| "CARPALX"
	| "NORMAN"
	| "Other";
type KeyboardBacklight = "RGB" | "Single Color" | "None";

type MouseSensor = "Optical" | "Laser" | "Infrared" | "Other";

type HeadphoneType = "Over-ear" | "On-ear" | "In-ear" | "Other";
type HeadphoneInterface =
	| "USB"
	| "Bluetooth"
	| "3.5 mm"
	| "2.5 mm"
	| "MMCX"
	| "Other";

type SpeakerType = "2.0" | "2.1" | "3.1" | "4.1" | "5.1" | "7.1" | "Other";
type SpeakerInterface =
	| "USB"
	| "Bluetooth"
	| "3.5 mm"
	| "2.5 mm"
	| "RCA"
	| "TRS"
	| "Wi-Fi"
	| "Other";

type WebcamResolution = "720p" | "1080p" | "1440p" | "4K" | "Other";
type WebcamFrameRate = "30 fps" | "60 fps" | "120 fps" | "240 fps" | "Other";
type WebcamInterface = "USB" | "Bluetooth" | "Wi-Fi" | "Other";
type WebcamMicrophone = "Yes" | "No";

type MicrophoneType =
	| "Condenser"
	| "Dynamic"
	| "Ribbon"
	| "USB"
	| "Wireless"
	| "Other";
type MicrophonePolarPattern =
	| "Cardioid"
	| "Supercardioid"
	| "Hypercardioid"
	| "Omnidirectional"
	| "Bidirectional"
	| "Other";
type MicrophoneInterface = "XLR" | "USB" | "3.5mm" | "Wireless" | "Other";

type StarRatingsCount = {
	halfStarRatings: number;
	oneStarRatings: number;
	oneHalfStarRatings: number;
	twoStarRatings: number;
	twoHalfStarRatings: number;
	threeStarRatings: number;
	threeHalfStarRatings: number;
	fourStarRatings: number;
	fourHalfStarRatings: number;
	fiveStarRatings: number;
};

type ProductServerResponse<
	Doc extends Record<string, any> = Record<string, any>,
> = Doc & {
	fileUploads: FileUploadDocument[];
};

export type {
	CaseSidePanel,
	CaseType,
	DimensionUnit,
	DisplayPanelType,
	HeadphoneInterface,
	HeadphoneType,
	KeyboardBacklight,
	KeyboardLayout,
	KeyboardSwitch,
	MemoryType,
	MemoryUnit,
	MicrophoneInterface,
	MicrophonePolarPattern,
	MicrophoneType,
	MobileOs,
	MotherboardFormFactor,
	MouseSensor,
	PeripheralsInterface,
	ProductAvailability,
	ProductCategory,
	ProductReview,
	ProductServerResponse,
	PsuEfficiency,
	PsuFormFactor,
	PsuModularity,
	SpeakerInterface,
	SpeakerType,
	StarRatingsCount,
	StorageFormFactor,
	StorageInterface,
	StorageType,
	WebcamFrameRate,
	WebcamInterface,
	WebcamMicrophone,
	WebcamResolution,
	WeightUnit,
};
