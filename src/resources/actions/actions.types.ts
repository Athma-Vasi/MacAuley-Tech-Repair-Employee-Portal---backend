import { Types } from "mongoose";
import { RequestAfterJWTVerification } from "../auth";
import { UserDocument, UserRoles } from "../user";
import { AddressChangeDocument } from "./company/addressChange";
import { ExpenseClaimDocument } from "./company/expenseClaim";
import { RequestResourceDocument } from "./company/requestResource";
import { LeaveRequestDocument } from "./company/leaveRequest";
import { BenefitsDocument } from "./company/benefit";
import { GetQueriedResourceRequest } from "../../types";
import { EndorsementDocument } from "./general/endorsement";
import { PrinterIssueDocument } from "./general/printerIssue";
import { AnonymousRequestDocument } from "./general/anonymousRequest";
import { RefermentDocument } from "./general/referment";
import { AnnouncementDocument } from "./outreach/announcement";
import { SurveyBuilderDocument } from "./outreach/survey";
import { EventCreatorDocument } from "./outreach/event";
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
  };
}

type ActionsResourceRequestServerResponse = {
  message: string;
  repairNoteData: RepairNoteDocument[];
  companyData: {
    addressChangeData: AddressChangeDocument[];
    expenseClaimData: ExpenseClaimDocument[];
    requestResourceData: RequestResourceDocument[];
    leaveRequestData: LeaveRequestDocument[];
    benefitData: BenefitsDocument[];
  };
  generalData: {
    endorsementData: EndorsementDocument[];
    printerIssueData: PrinterIssueDocument[];
    anonymousRequestData?: AnonymousRequestDocument[];
    refermentData: RefermentDocument[];
  };
  outreachData: {
    announcementData: AnnouncementDocument[];
    surveyData: SurveyBuilderDocument[];
    eventData: EventCreatorDocument[];
  };
  employeeData: UserDocument[];
};

export type {
  Action,
  GetAllActionsResourceRequest,
  GetUsersActionsResourceRequest,
  ActionsResourceRequestServerResponse,
};
