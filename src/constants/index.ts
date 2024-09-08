import { Types } from "mongoose";
import { ProductCategory } from "../resources/productCategory";
import { getAccessoryByIdService } from "../resources/productCategory/accessory";
import { DatabaseResponseResultNullable } from "../types";
import { getCpuByIdService } from "../resources/productCategory/cpu";
import { getComputerCaseByIdService } from "../resources/productCategory/computerCase";
import { getDesktopComputerByIdService } from "../resources/productCategory/desktopComputer";
import { getDisplayByIdService } from "../resources/productCategory/display";
import { getGpuByIdService } from "../resources/productCategory/gpu";
import { getHeadphoneByIdService } from "../resources/productCategory/headphone";
import { getKeyboardByIdService } from "../resources/productCategory/keyboard";
import { getLaptopByIdService } from "../resources/productCategory/laptop";
import { getRamByIdService } from "../resources/productCategory/ram";
import { getMicrophoneByIdService } from "../resources/productCategory/microphone";
import { getMotherboardByIdService } from "../resources/productCategory/motherboard";
import { getMouseByIdService } from "../resources/productCategory/mouse";
import { getPsuByIdService } from "../resources/productCategory/psu";
import { getSmartphoneByIdService } from "../resources/productCategory/smartphone";
import { getSpeakerByIdService } from "../resources/productCategory/speaker";
import { getStorageByIdService } from "../resources/productCategory/storage";
import { getTabletByIdService } from "../resources/productCategory/tablet";
import { getWebcamByIdService } from "../resources/productCategory/webcam";

const ALLOWED_FILE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

/**
 * @description Map of product category names to their respective service functions.
 * - used in `src/resources/productCategory/productCategory.controller.ts`
 */
const PRODUCT_CATEGORY_SERVICE_MAP: Record<
  ProductCategory,
  (
    id: string | Types.ObjectId,
  ) => DatabaseResponseResultNullable<Record<string, any>>
> = {
  Accessory: getAccessoryByIdService,
  "Central Processing Unit (CPU)": getCpuByIdService,
  "Computer Case": getComputerCaseByIdService,
  "Desktop Computer": getDesktopComputerByIdService,
  Display: getDisplayByIdService,
  "Graphics Processing Unit (GPU)": getGpuByIdService,
  Headphone: getHeadphoneByIdService,
  Keyboard: getKeyboardByIdService,
  Laptop: getLaptopByIdService,
  "Memory (RAM)": getRamByIdService,
  Microphone: getMicrophoneByIdService,
  Motherboard: getMotherboardByIdService,
  Mouse: getMouseByIdService,
  "Power Supply Unit (PSU)": getPsuByIdService,
  Smartphone: getSmartphoneByIdService,
  Speaker: getSpeakerByIdService,
  Storage: getStorageByIdService,
  Tablet: getTabletByIdService,
  Webcam: getWebcamByIdService,
};

export { ALLOWED_FILE_EXTENSIONS, PRODUCT_CATEGORY_SERVICE_MAP };
