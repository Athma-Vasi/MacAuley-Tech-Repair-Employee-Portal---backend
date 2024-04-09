import Joi from "joi";
import {
  CURRENCY_REGEX,
  GRAMMAR_TEXTAREA_INPUT_REGEX,
  PARTS_NEEDED_REGEX,
  REPAIR_CATEGORY_REGEX,
  REPAIR_STATUS_REGEX,
  REQUIRED_REPAIRS_REGEX,
  SERIAL_ID_REGEX,
  URGENCY_REGEX,
} from "../../regex";

const createRepairTicketJoiSchema = Joi.object({
  customerId: Joi.string().required(),

  partName: Joi.string().regex(SERIAL_ID_REGEX).required(),
  partSerialId: Joi.string().regex(SERIAL_ID_REGEX).required(),
  dateReceived: Joi.date().required(),
  descriptionOfIssue: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX).required(),
  initialInspectionNotes: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX).required(),

  repairCategory: Joi.string().regex(REPAIR_CATEGORY_REGEX).required(),
  requiredRepairs: Joi.array()
    .items(Joi.string().regex(REQUIRED_REPAIRS_REGEX))
    .required(),
  partsNeeded: Joi.array().items(Joi.string().regex(PARTS_NEEDED_REGEX)).required(),
  partsNeededModels: Joi.string().regex(SERIAL_ID_REGEX).required(),
  partUnderWarranty: Joi.boolean().required(),
  estimatedRepairCostCurrency: Joi.string().regex(CURRENCY_REGEX).required(),
  estimatedRepairCost: Joi.number().required(),
  estimatedCompletionDate: Joi.date().required(),
  repairPriority: Joi.string().regex(URGENCY_REGEX).required(),
  workOrderId: Joi.string().required(),

  repairNotes: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX).required(),
  testingResults: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX).required(),
  finalRepairCost: Joi.number().required(),
  finalRepairCostCurrency: Joi.string().regex(CURRENCY_REGEX).required(),
  repairStatus: Joi.string().regex(REPAIR_STATUS_REGEX).required(),
});

const updateRepairTicketJoiSchema = Joi.object({
  partName: Joi.string().regex(SERIAL_ID_REGEX).optional(),
  partSerialId: Joi.string().regex(SERIAL_ID_REGEX).optional(),
  dateReceived: Joi.date().optional(),
  descriptionOfIssue: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX).optional(),
  initialInspectionNotes: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX).optional(),

  repairCategory: Joi.string().regex(REPAIR_CATEGORY_REGEX).optional(),
  requiredRepairs: Joi.array()
    .items(Joi.string().regex(REQUIRED_REPAIRS_REGEX))
    .optional(),
  partsNeeded: Joi.array().items(Joi.string().regex(PARTS_NEEDED_REGEX)).optional(),
  partsNeededModels: Joi.string().regex(SERIAL_ID_REGEX).optional(),
  partUnderWarranty: Joi.boolean().optional(),
  estimatedRepairCostCurrency: Joi.string().regex(CURRENCY_REGEX).optional(),
  estimatedRepairCost: Joi.number().optional(),
  estimatedCompletionDate: Joi.date().optional(),
  repairPriority: Joi.string().regex(URGENCY_REGEX).optional(),
  workOrderId: Joi.string().optional(),

  repairNotes: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX).optional(),
  testingResults: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX).optional(),
  finalRepairCost: Joi.number().optional(),
  finalRepairCostCurrency: Joi.string().regex(CURRENCY_REGEX).optional(),
  repairStatus: Joi.string().regex(REPAIR_STATUS_REGEX).optional(),
});

export { createRepairTicketJoiSchema, updateRepairTicketJoiSchema };
