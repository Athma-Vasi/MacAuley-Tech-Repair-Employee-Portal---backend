import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../auth';
import type { ActionsGeneral } from '../actionsGeneral.types';
import type { Urgency, PrinterIssueDocument } from './printerIssue.model';
import type { PhoneNumber, UserRoles } from '../../../user';

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body
interface CreateNewPrinterIssueRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    title: string;
    contactNumber: PhoneNumber;
    contactEmail: string;
    dateOfOccurrence: string;
    timeOfOccurrence: string;
    printerMake: string;
    printerModel: string;
    printerSerialNumber: string;
    printerIssueDescription: string;
    urgency: Urgency;
    additionalInformation: string;
  };
}

interface UpdatePrinterIssueRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    title: string;
    contactNumber: PhoneNumber;
    contactEmail: string;
    dateOfOccurrence: string;
    timeOfOccurrence: string;
    printerMake: string;
    printerModel: string;
    printerSerialNumber: string;
    printerIssueDescription: string;
    urgency: Urgency;
    additionalInformation: string;
  };
  params: {
    printerIssueId: string;
  };
}

interface DeletePrinterIssueRequest extends RequestAfterJWTVerification {
  params: {
    printerIssueId: string;
  };
}

type DeleteAllPrinterIssuesRequest = RequestAfterJWTVerification;

type GetAllPrinterIssuesRequest = RequestAfterJWTVerification;

interface GetAPrinterIssueRequest extends RequestAfterJWTVerification {
  params: {
    printerIssueId: string;
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
