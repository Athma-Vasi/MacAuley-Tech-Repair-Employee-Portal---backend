import { Schema, Types, model } from 'mongoose';
import { Urgency } from '../actions/general/printerIssue';
import { Country, PostalCode, Province, StatesUS } from '../user';
import { Currency } from '../actions/company/expenseClaim';

type RequiredRepairs =
  | 'Cleaning'
  | 'Component replacement'
  | 'Soldering'
  | 'Testing'
  | 'Calibration'
  | 'Software update'
  | 'Diagnostic evaluation'
  | 'Internal inspection'
  | 'External housing'
  | 'Data recovery'
  | 'Other';

type PartsNeeded =
  | 'CPU'
  | 'GPU'
  | 'Motherboard'
  | 'RAM'
  | 'Storage'
  | 'PSU'
  | 'Cooling'
  | 'Connectors'
  | 'Software'
  | 'Other';

type RepairStatus =
  | 'In progress'
  | 'Waiting for parts'
  | 'Awaiting approval'
  | 'Completed'
  | 'Cancelled';

type RepairNoteSchema = {
  userId: Types.ObjectId;
  username: string;

  /** initial repair note state when item was brought in */

  // customer information
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddressLine: string;
  customerCity: string;
  customerState: StatesUS;
  customerProvince: Province;
  customerCountry: Country;
  customerPostalCode: PostalCode;

  // part information
  partName: string;
  partSerialId: string;
  dateReceived: Date;
  descriptionOfIssue: string;
  initialInspectionNotes: string;

  // repair information
  requiredRepairs: RequiredRepairs[];
  partsNeeded: PartsNeeded[];
  partsNeededModels: string;
  partUnderWarranty: boolean;
  estimatedRepairCostCurrency: Currency;
  estimatedRepairCost: string;
  estimatedCompletionDate: Date;
  repairPriority: Urgency;
  workOrderId: string; // generated by the system

  /** ongoing and final (updated) repair note state */
  repairNotes: string;
  testingResults: string;
  finalRepairCost: string;
  finalRepairCostCurrency: Currency;
  repairStatus: RepairStatus;
};

type RepairNoteDocument = RepairNoteSchema & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

type RepairNoteInitialSchema = Omit<
  RepairNoteSchema,
  'repairNotes' | 'testingResults' | 'finalRepairCost' | 'repairStatus' | 'finalRepairCostCurrency'
>;

type RepairNoteFinalSchema = RepairNoteSchema;

const repairNoteSchema = new Schema<RepairNoteSchema>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, 'User ID is required'],
      ref: 'User',
      index: true,
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      index: true,
    },

    // part information
    partName: {
      type: String,
      required: [true, 'Part name is required'],
    },
    partSerialId: {
      type: String,
      required: [true, 'Part serial ID is required'],
    },
    dateReceived: {
      type: Date,
      required: [true, 'Date received is required'],
      index: true,
    },
    descriptionOfIssue: {
      type: String,
      required: [true, 'Description of issue is required'],
    },
    initialInspectionNotes: {
      type: String,
      required: [true, 'Initial inspection notes are required'],
    },

    // customer information
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
    },
    customerPhone: {
      type: String,
      required: [true, 'Customer phone number is required'],
    },
    customerEmail: {
      type: String,
      required: [true, 'Customer email is required'],
    },
    customerAddressLine: {
      type: String,
      required: [true, 'Customer address is required'],
    },
    customerCity: {
      type: String,
      required: [true, 'Customer city is required'],
    },
    customerState: {
      type: String,
      required: [true, 'Customer state is required'],
    },
    customerProvince: {
      type: String,
      required: [true, 'Customer province is required'],
    },
    customerCountry: {
      type: String,
      required: [true, 'Customer country is required'],
    },
    customerPostalCode: {
      type: String,
      required: [true, 'Customer postal code is required'],
    },

    // repair information
    requiredRepairs: {
      type: [String],
      required: [true, 'Required repairs are required'],
      index: true,
    },
    partsNeeded: {
      type: [String],
      required: [true, 'Parts needed are required'],
      index: true,
    },
    partsNeededModels: {
      type: String,
      required: [true, 'Parts needed models are required'],
    },
    partUnderWarranty: {
      type: Boolean,
      required: [true, 'Part under warranty is required'],
    },
    estimatedRepairCost: {
      type: String,
      required: [true, 'Estimated repair cost is required'],
    },
    estimatedRepairCostCurrency: {
      type: String,
      required: [true, 'Estimated repair cost currency is required'],
    },
    estimatedCompletionDate: {
      type: Date,
      required: [true, 'Estimated completion date is required'],
    },
    repairPriority: {
      type: String,
      required: [true, 'Repair priority is required'],
    },
    workOrderId: {
      type: String,
      required: [true, 'Work order ID is required'],
    },

    // repair notes
    repairNotes: {
      type: String,
      required: false,
      default: '',
    },
    testingResults: {
      type: String,
      required: false,
      default: '',
    },
    finalRepairCost: {
      type: String,
      required: false,
      default: '',
    },
    finalRepairCostCurrency: {
      type: String,
      required: false,
      default: 'CAD',
    },
    repairStatus: {
      type: String,
      required: false,
      default: 'In progress',
    },
  },
  {
    timestamps: true,
  }
);

const RepairNoteModel = model<RepairNoteDocument>('RepairNote', repairNoteSchema);

export { RepairNoteModel };
export type {
  RepairNoteSchema,
  RepairNoteDocument,
  RequiredRepairs,
  PartsNeeded,
  RepairStatus,
  RepairNoteInitialSchema,
  RepairNoteFinalSchema,
};
