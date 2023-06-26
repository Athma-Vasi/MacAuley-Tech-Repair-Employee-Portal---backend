import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../auth';
import type { ActionsGeneral } from '../actionsGeneral.types';
import type { PrinterIssueUrgency } from './printerIssue.model';

interface CreateNewPrinterIssueRequest extends RequestAfterJWTVerification {
  body: {
    userId: Types.ObjectId;
    title: ActionsGeneral;
    username: string;
    contactNumber: string;
    contactEmail: string;
    printerMake: string;
    printerModel: string;
    printerSerialNumber: string;
    printerIssueDescription: string;
    urgency: PrinterIssueUrgency;
    additionalInformation: string;
  };
}
