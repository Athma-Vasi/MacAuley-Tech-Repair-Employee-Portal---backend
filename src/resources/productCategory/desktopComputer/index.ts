/**
 * This barrel file is used to import/export desktopComputer router, model, types, controllers and services
 */

/**
 * Imports
 */
import { desktopComputerRouter } from "./desktopComputer.routes";
import { DesktopComputerModel } from "./desktopComputer.model";

import type {
  DesktopComputerDocument,
  DesktopComputerSchema,
} from "./desktopComputer.model";

/**
 * Exports
 */

export { DesktopComputerModel, desktopComputerRouter };

export type { DesktopComputerDocument, DesktopComputerSchema };
