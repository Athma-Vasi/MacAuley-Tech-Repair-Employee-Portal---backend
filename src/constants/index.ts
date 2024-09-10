const ALLOWED_FILE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

const REFRESH_TOKEN_EXPIRES_IN = "12h"; // 12 hours

const ACCESS_TOKEN_EXPIRES_IN = "60s"; // 60 seconds

// /**
//  * @description Map of product category names to their respective service functions.
//  * - used in `src/resources/productCategory/productCategory.controller.ts`
//  */
// const PRODUCT_CATEGORY_SERVICE_MAP: Record<
//   ProductCategory,
//   (
//     id: string | Types.ObjectId,
//   ) => DatabaseResponseResultNullable<Record<string, any>>
// > = {
//   Accessory: getAccessoryByIdService,
//   "Central Processing Unit (CPU)": getCpuByIdService,
//   "Computer Case": getComputerCaseByIdService,
//   "Desktop Computer": getDesktopComputerByIdService,
//   Display: getDisplayByIdService,
//   "Graphics Processing Unit (GPU)": getGpuByIdService,
//   Headphone: getHeadphoneByIdService,
//   Keyboard: getKeyboardByIdService,
//   Laptop: getLaptopByIdService,
//   "Memory (RAM)": getRamByIdService,
//   Microphone: getMicrophoneByIdService,
//   Motherboard: getMotherboardByIdService,
//   Mouse: getMouseByIdService,
//   "Power Supply Unit (PSU)": getPsuByIdService,
//   Smartphone: getSmartphoneByIdService,
//   Speaker: getSpeakerByIdService,
//   Storage: getStorageByIdService,
//   Tablet: getTabletByIdService,
//   Webcam: getWebcamByIdService,
// };

export {
  ACCESS_TOKEN_EXPIRES_IN,
  ALLOWED_FILE_EXTENSIONS,
  REFRESH_TOKEN_EXPIRES_IN,
};
