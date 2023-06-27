import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../auth';
import type { ActionsGeneral } from '../actionsGeneral.types';
import type { PrinterIssueUrgency, PrinterIssueDocument } from './printerIssue.model';
import type { UserRoles } from '../../../user';

interface CreateNewPrinterIssueRequest extends RequestAfterJWTVerification {
  // userInfo object is decoded from the JWT in the auth middleware: verifyJWT.ts
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

interface UpdatePrinterIssueRequest extends RequestAfterJWTVerification {
  // userInfo object is decoded from the JWT in the auth middleware: verifyJWT.ts
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
  params: {
    printerIssueId: Types.ObjectId;
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

type PrinterIssuesServerResponse = {
  message: string;
  printerIssueData: Array<PrinterIssueDocument>;
};

export type {
  CreateNewPrinterIssueRequest,
  DeletePrinterIssueRequest,
  DeleteAllPrinterIssuesRequest,
  GetAllPrinterIssuesRequest,
  GetAPrinterIssueRequest,
  GetPrinterIssuesFromUserRequest,
  PrinterIssuesServerResponse,
  UpdatePrinterIssueRequest,
};
