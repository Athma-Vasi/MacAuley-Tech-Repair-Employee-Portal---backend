import { Schema, Types, model } from "mongoose";
import { Urgency } from "../actions/general/printerIssue";
import { Currency } from "../actions/company/expenseClaim";

type RepairCategory =
  | "Computer Component"
  | "Peripheral"
  | "Electronic Device"
  | "Mobile Device"
  | "Audio/Video"
  | "Accessory";

type RequiredRepairs =
  | "Cleaning"
  | "Component replacement"
  | "Soldering"
  | "Testing"
  | "Calibration"
  | "Software update"
  | "Diagnostic evaluation"
  | "Internal inspection"
  | "External housing"
  | "Data recovery"
  | "Other";

type PartsNeeded =
  | "CPU"
  | "GPU"
  | "Motherboard"
  | "RAM"
  | "Storage"
  | "PSU"
  | "Cooling"
  | "Connectors"
  | "Software"
  | "Other";

type RepairStatus =
  | "In progress"
  | "Waiting for parts"
  | "Awaiting approval"
  | "Completed"
  | "Cancelled";

type RepairTicketSchema = {
  userId: Types.ObjectId;
  username: string;
  customerId: Types.ObjectId;

  /** initial repair note state when item was brought in */

  // part information
  partName: string;
  partSerialId: string;
  dateReceived: Date;
  descriptionOfIssue: string;
  initialInspectionNotes: string;

  // repair information
  repairCategory: RepairCategory;
  requiredRepairs: RequiredRepairs[];
  partsNeeded: PartsNeeded[];
  partsNeededModels: string;
  partUnderWarranty: boolean;
  estimatedRepairCostCurrency: Currency;
  estimatedRepairCost: number;
  estimatedCompletionDate: Date;
  repairPriority: Urgency;
  workOrderId: string;

  /** ongoing and final (updated) repair note state */
  repairNotes: string;
  testingResults: string;
  finalRepairCost: number;
  finalRepairCostCurrency: Currency;
  repairStatus: RepairStatus;
};

type RepairTicketDocument = RepairTicketSchema & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

type RepairTicketInitialSchema = Omit<
  RepairTicketSchema,
  | "repairTickets"
  | "testingResults"
  | "finalRepairCost"
  | "repairStatus"
  | "finalRepairCostCurrency"
>;

type RepairTicketFinalSchema = RepairTicketSchema;

const repairTicketSchema = new Schema<RepairTicketSchema>(
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
    customerId: {
      type: Schema.Types.ObjectId,
      required: [true, "Customer ID is required"],
      ref: "Customer",
      index: true,
    },

    // part information
    partName: {
      type: String,
      required: [true, "Part name is required"],
    },
    partSerialId: {
      type: String,
      required: [true, "Part serial ID is required"],
    },
    dateReceived: {
      type: Date,
      required: [true, "Date received is required"],
      index: true,
    },
    descriptionOfIssue: {
      type: String,
      required: [true, "Description of issue is required"],
    },
    initialInspectionNotes: {
      type: String,
      required: [true, "Initial inspection notes are required"],
    },

    // repair information
    repairCategory: {
      type: String,
      required: [true, "Repair category is required"],
      index: true,
    },
    requiredRepairs: {
      type: [String],
      required: [true, "Required repairs are required"],
      index: true,
    },
    partsNeeded: {
      type: [String],
      required: [true, "Parts needed are required"],
      index: true,
    },
    partsNeededModels: {
      type: String,
      required: [true, "Parts needed models are required"],
    },
    partUnderWarranty: {
      type: Boolean,
      required: [true, "Part under warranty is required"],
    },
    estimatedRepairCost: {
      type: Number,
      required: [true, "Estimated repair cost is required"],
      index: true,
    },
    estimatedRepairCostCurrency: {
      type: String,
      required: [true, "Estimated repair cost currency is required"],
      index: true,
    },
    estimatedCompletionDate: {
      type: Date,
      required: [true, "Estimated completion date is required"],
    },
    repairPriority: {
      type: String,
      required: [true, "Repair priority is required"],
      index: true,
    },
    workOrderId: {
      type: String,
      required: false,
      index: true,
    },

    // repair notes
    repairNotes: {
      type: String,
      required: false,
      default: "",
    },
    testingResults: {
      type: String,
      required: false,
      default: "",
    },
    finalRepairCost: {
      type: Number,
      required: false,
      default: 0,
      index: true,
    },
    finalRepairCostCurrency: {
      type: String,
      required: false,
      default: "CAD",
      index: true,
    },
    repairStatus: {
      type: String,
      required: false,
      default: "In progress",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// text index for searching
repairTicketSchema.index({
  username: "text",
  partName: "text",
  partSerialId: "text",
  descriptionOfIssue: "text",
  initialInspectionNotes: "text",
  customerName: "text",
  customerPhone: "text",
  customerEmail: "text",
  customerAddressLine: "text",
  customerCity: "text",
  customerPostalCode: "text",
  partsNeededModels: "text",
  repairTickets: "text",
  testingResults: "text",
});

const RepairTicketModel = model<RepairTicketDocument>("RepairTicket", repairTicketSchema);

export { RepairTicketModel };
export type {
  RepairTicketSchema,
  RepairTicketDocument,
  RequiredRepairs,
  PartsNeeded,
  RepairStatus,
  RepairTicketInitialSchema,
  RepairTicketFinalSchema,
};
