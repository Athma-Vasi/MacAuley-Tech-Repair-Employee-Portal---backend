import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../auth';

import type { Urgency, PrinterIssueDocument, PrinterMake, TimeRailway } from './printerIssue.model';
import type { PhoneNumber, UserRoles } from '../../../user';
import { GetQueriedResourceRequest, RequestStatus } from '../../../../types';

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body
interface CreateNewPrinterIssueRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    printerIssue: {
      title: string;
      contactNumber: PhoneNumber;
      contactEmail: string;
      dateOfOccurrence: NativeDate;
      timeOfOccurrence: TimeRailway;
      printerMake: PrinterMake;
      printerModel: string;
      printerSerialNumber: string;
      printerIssueDescription: string;
      urgency: Urgency;
      additionalInformation: string;
      requestStatus: RequestStatus;
    };
  };
}

interface UpdatePrinterIssueStatusByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    printerIssue: {
      requestStatus: RequestStatus;
    };
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

type GetQueriedPrinterIssuesRequest = GetQueriedResourceRequest;

interface GetAPrinterIssueRequest extends RequestAfterJWTVerification {
  params: {
    printerIssueId: string;
  };
}

type GetQueriedPrinterIssuesByUserRequest = GetQueriedResourceRequest;

export type {
  CreateNewPrinterIssueRequest,
  DeletePrinterIssueRequest,
  DeleteAllPrinterIssuesRequest,
  GetQueriedPrinterIssuesRequest,
  GetAPrinterIssueRequest,
  GetQueriedPrinterIssuesByUserRequest,
  UpdatePrinterIssueStatusByIdRequest,
};
