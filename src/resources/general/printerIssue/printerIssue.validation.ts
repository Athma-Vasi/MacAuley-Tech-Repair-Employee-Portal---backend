import Joi from "joi";
import {
  GRAMMAR_TEXT_INPUT_REGEX,
  GRAMMAR_TEXTAREA_INPUT_REGEX,
  PRINTER_MAKE_MODEL_REGEX,
  PRINTER_MAKE_REGEX,
  PRINTER_SERIAL_NUMBER_REGEX,
  TIME_RAILWAY_REGEX,
  URGENCY_REGEX,
} from "../../../regex";

const createPrinterIssueJoiSchema = Joi.object({
  title: Joi.string().regex(GRAMMAR_TEXT_INPUT_REGEX).required(),
  contactEmail: Joi.string().email().required(),
  dateOfOccurrence: Joi.date().required(),
  timeOfOccurrence: Joi.string().regex(TIME_RAILWAY_REGEX).required(),
  printerMake: Joi.string().regex(PRINTER_MAKE_REGEX).required(),
  printerModel: Joi.string().regex(PRINTER_MAKE_MODEL_REGEX).required(),
  printerSerialNumber: Joi.string().regex(PRINTER_SERIAL_NUMBER_REGEX)
    .required(),
  printerIssueDescription: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX)
    .required(),
  urgency: Joi.string().regex(URGENCY_REGEX).required(),
  additionalInformation: Joi.string().required(),
});

const updatePrinterIssueJoiSchema = Joi.object({
  title: Joi.string().regex(GRAMMAR_TEXT_INPUT_REGEX),
  contactEmail: Joi.string().email(),
  dateOfOccurrence: Joi.date(),
  timeOfOccurrence: Joi.string().regex(TIME_RAILWAY_REGEX),
  printerMake: Joi.string().regex(PRINTER_MAKE_REGEX),
  printerModel: Joi.string().regex(PRINTER_MAKE_MODEL_REGEX),
  printerSerialNumber: Joi.string().regex(PRINTER_SERIAL_NUMBER_REGEX),
  printerIssueDescription: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX),
  urgency: Joi.string().regex(URGENCY_REGEX),
  additionalInformation: Joi.string(),
});

export { createPrinterIssueJoiSchema, updatePrinterIssueJoiSchema };
