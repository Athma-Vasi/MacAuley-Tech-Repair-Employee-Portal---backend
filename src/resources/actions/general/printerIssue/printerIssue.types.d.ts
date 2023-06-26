import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../auth';
import type { ActionsGeneral } from '../actionsGeneral.types';
import type { PrinterIssueUrgency } from './printerIssue.model';
import { UserRoles } from '../../../user';

interface CreateNewPrinterIssueRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    title: ActionsGeneral;
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

interface DeletePrinterIssueRequest extends RequestAfterJWTVerification {
  params: {
    printerIssueId: Types.ObjectId;
  };
}

type DeleteAllPrinterIssuesRequest = RequestAfterJWTVerification;

type GetAllPrinterIssuesRequest = RequestAfterJWTVerification;

interface GetAPrinterIssueRequest extends RequestAfterJWTVerification {
  params: {
    printerIssueId: Types.ObjectId;
  };
}

type GetPrinterIssuesFromUserRequest = RequestAfterJWTVerification;

export type {
  CreateNewPrinterIssueRequest,
  DeletePrinterIssueRequest,
  DeleteAllPrinterIssuesRequest,
  GetAllPrinterIssuesRequest,
  GetAPrinterIssueRequest,
  GetPrinterIssuesFromUserRequest,
};
