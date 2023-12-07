import { Types } from "mongoose";
import { RequestAfterJWTVerification } from "../auth";
import { UserDocument, UserRoles } from "../user";
import { AddressChangeDocument } from "./company/addressChange";
import { ExpenseClaimDocument } from "./company/expenseClaim";
import { RequestResourceDocument } from "./company/requestResource";
import { LeaveRequestDocument } from "./company/leaveRequest";
import { BenefitDocument } from "./company/benefit";
import { GetQueriedResourceRequest } from "../../types";
import { EndorsementDocument } from "./general/endorsement";
import { PrinterIssueDocument } from "./general/printerIssue";
import { AnonymousRequestDocument } from "./general/anonymousRequest";
import { RefermentDocument } from "./general/referment";
import { AnnouncementDocument } from "./outreach/announcement";
import { SurveyDocument } from "./outreach/survey";
import { EventDocument } from "./outreach/event";
import { RepairNoteDocument } from "../repairNote";

type Action = "company" | "general" | "outreach" | "dashboard";

type GetAllActionsResourceRequest = GetQueriedResourceRequest;

interface GetUsersActionsResourceRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    // newQueryFlag: boolean;
    // totalDocuments: number;
  };
  // query: {
  //   projection: string | string[] | Record<string, any>;
  //   options: Record<string, any>;
  //   filter: Record<string, any>;
  // };
}

type ActionsResourceRequestServerResponse = {
  message: string;
  repairNoteData: RepairNoteDocument[];
  companyData: {
    addressChangeData: AddressChangeDocument[];
    expenseClaimData: ExpenseClaimDocument[];
    requestResourceData: RequestResourceDocument[];
    leaveRequestData: LeaveRequestDocument[];
    benefitData: BenefitDocument[];
  };
  generalData: {
    endorsementData: EndorsementDocument[];
    printerIssueData: PrinterIssueDocument[];
    anonymousRequestData?: AnonymousRequestDocument[];
    refermentData: RefermentDocument[];
  };
  outreachData: {
    announcementData: AnnouncementDocument[];
    surveyData: SurveyDocument[];
    eventData: EventDocument[];
  };
  employeeData: UserDocument[];
};

export type {
  Action,
  GetAllActionsResourceRequest,
  GetUsersActionsResourceRequest,
  ActionsResourceRequestServerResponse,
};
