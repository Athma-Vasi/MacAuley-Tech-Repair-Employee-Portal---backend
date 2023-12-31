import expressAsyncHandler from "express-async-handler";
import {
  ActionsResourceRequestServerResponse,
  GetAllActionsResourceRequest,
  GetUsersActionsResourceRequest,
} from "./actions.types";
import { Response } from "express";
import {
  AddressChangeDocument,
  getQueriedAddressChangesByUserService,
  getQueriedAddressChangesService,
} from "./company/addressChange";
import { QueryObjectParsedWithDefaults } from "../../types";
import { FilterQuery, QueryOptions } from "mongoose";
import {
  ExpenseClaimDocument,
  getQueriedExpenseClaimsByUserService,
  getQueriedExpenseClaimsService,
} from "./company/expenseClaim";
import {
  RequestResourceDocument,
  getQueriedRequestResourcesByUserService,
  getQueriedRequestResourcesService,
} from "./company/requestResource";
import {
  LeaveRequestDocument,
  getQueriedLeaveRequestsByUserService,
  getQueriedLeaveRequestsService,
} from "./company/leaveRequest";
import {
  BenefitDocument,
  getQueriedBenefitsByUserService,
  getQueriedBenefitsService,
} from "./company/benefit";
import {
  EndorsementDocument,
  getQueriedEndorsementsByUserService,
  getQueriedEndorsementsService,
} from "./general/endorsement";
import {
  PrinterIssueDocument,
  getQueriedPrinterIssuesByUserService,
  getQueriedPrinterIssuesService,
} from "./general/printerIssue";
import {
  AnonymousRequestDocument,
  getQueriedAnonymousRequestsService,
} from "./general/anonymousRequest";
import {
  RefermentDocument,
  getQueriedRefermentsByUserService,
  getQueriedRefermentsService,
} from "./general/referment";
import {
  AnnouncementDocument,
  getQueriedAnnouncementsService,
} from "./outreach/announcement";
import {
  SurveyDocument,
  getQueriedSurveysByUserService,
  getQueriedSurveysService,
} from "./outreach/survey";
import {
  EventDocument,
  getQueriedEventsByUserService,
  getQueriedEventsService,
} from "./outreach/event";
import { RepairTicketDocument, getQueriedRepairTicketsService } from "../repairTicket";
import { UserDocument, getQueriedUsersService } from "../user";
import { getAllUsersService } from "../user/user.service";

// @desc  get all actions company data
// @route  /actions/home
// @access Private/Manager/Admin
const getAllActionsDocumentsHandler = expressAsyncHandler(
  async (
    request: GetAllActionsResourceRequest,
    response: Response<ActionsResourceRequestServerResponse>
  ) => {
    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    const awaitingApprovalFilter = {
      ...filter,
      repairStatus: { $in: ["Awaiting approval"] },
    };
    const pendingFilter = {
      ...filter,
      requestStatus: { $in: ["pending"] },
    };
    const surveyOptions = {
      limit: 5,
      sort: { expiryDate: 1, _id: 1 },
      skip: 0,
    };
    const eventOptions = {
      limit: 5,
      sort: { eventStartDate: 1, _id: 1 },
      skip: 0,
    };

    const actionsData = await Promise.all([
      // repair notes
      getQueriedRepairTicketsService({
        filter: awaitingApprovalFilter as FilterQuery<RepairTicketDocument> | undefined,
        projection: projection as QueryOptions<RepairTicketDocument>,
        options: options as QueryOptions<RepairTicketDocument>,
      }),
      // company data
      // address change
      getQueriedAddressChangesService({
        filter: pendingFilter as FilterQuery<AddressChangeDocument> | undefined,
        projection: projection as QueryOptions<AddressChangeDocument>,
        options: options as QueryOptions<AddressChangeDocument>,
      }),
      // expense claim
      getQueriedExpenseClaimsService({
        filter: pendingFilter as FilterQuery<ExpenseClaimDocument> | undefined,
        projection: projection as QueryOptions<ExpenseClaimDocument>,
        options: options as QueryOptions<ExpenseClaimDocument>,
      }),
      // request resource
      getQueriedRequestResourcesService({
        filter: pendingFilter as FilterQuery<RequestResourceDocument> | undefined,
        projection: projection as QueryOptions<RequestResourceDocument>,
        options: options as QueryOptions<RequestResourceDocument>,
      }),
      // leave request
      getQueriedLeaveRequestsService({
        filter: pendingFilter as FilterQuery<LeaveRequestDocument> | undefined,
        projection: projection as QueryOptions<LeaveRequestDocument>,
        options: options as QueryOptions<LeaveRequestDocument>,
      }),
      // benefits
      getQueriedBenefitsService({
        filter: pendingFilter as FilterQuery<BenefitDocument> | undefined,
        projection: projection as QueryOptions<BenefitDocument>,
        options: options as QueryOptions<BenefitDocument>,
      }),

      // general data
      // endorsement
      getQueriedEndorsementsService({
        filter: filter as FilterQuery<EndorsementDocument> | undefined,
        projection: projection as QueryOptions<EndorsementDocument>,
        options: options as QueryOptions<EndorsementDocument>,
      }),
      // printer issue
      getQueriedPrinterIssuesService({
        filter: pendingFilter as FilterQuery<PrinterIssueDocument> | undefined,
        projection: projection as QueryOptions<PrinterIssueDocument>,
        options: options as QueryOptions<PrinterIssueDocument>,
      }),
      // anonymous request
      getQueriedAnonymousRequestsService({
        filter: pendingFilter as FilterQuery<AnonymousRequestDocument> | undefined,
        projection: projection as QueryOptions<AnonymousRequestDocument>,
        options: options as QueryOptions<AnonymousRequestDocument>,
      }),
      // referment
      getQueriedRefermentsService({
        filter: pendingFilter as FilterQuery<RefermentDocument> | undefined,
        projection: projection as QueryOptions<RefermentDocument>,
        options: options as QueryOptions<RefermentDocument>,
      }),

      // outreach data
      // announcement
      getQueriedAnnouncementsService({
        filter: filter as FilterQuery<AnnouncementDocument> | undefined,
        projection: projection as QueryOptions<AnnouncementDocument>,
        options: options as QueryOptions<AnnouncementDocument>,
      }),
      // survey
      getQueriedSurveysService({
        filter: filter as FilterQuery<SurveyDocument> | undefined,
        projection: projection as QueryOptions<SurveyDocument>,
        options: surveyOptions as QueryOptions<SurveyDocument>,
      }),
      // event
      getQueriedEventsService({
        filter: filter as FilterQuery<EventDocument> | undefined,
        projection: projection as QueryOptions<EventDocument>,
        options: eventOptions as QueryOptions<EventDocument>,
      }),

      // employees
      getAllUsersService(),
    ]);

    const [
      // repair notes
      repairTicketData,
      // company data
      addressChangeData,
      expenseClaimData,
      requestResourceData,
      leaveRequestData,
      benefitsData,
      // general data
      endorsementData,
      printerIssueData,
      anonymousRequestData,
      refermentData,
      // outreach data
      announcementData,
      surveyData,
      eventData,
      // employees
      employeeData,
    ] = actionsData;

    response.status(200).json({
      message: "Successfully retrieved all actions data",
      repairTicketData: repairTicketData.filter((data) => data),
      companyData: {
        addressChangeData: addressChangeData.filter((data) => data),
        expenseClaimData: expenseClaimData.filter((data) => data),
        requestResourceData: requestResourceData.filter((data) => data),
        leaveRequestData: leaveRequestData.filter((data) => data),
        benefitData: benefitsData.filter((data) => data),
      },
      generalData: {
        endorsementData: endorsementData.filter((data) => data),
        printerIssueData: printerIssueData.filter((data) => data),
        anonymousRequestData: anonymousRequestData.filter((data) => data),
        refermentData: refermentData.filter((data) => data),
      },
      outreachData: {
        announcementData: announcementData.filter((data) => data),
        surveyData: surveyData.filter((data) => data),
        eventData: eventData.filter((data) => data),
      },
      employeeData: employeeData.filter((data) => data),
    });

    return;
  }
);

// @desc   get employee's actions company data
// @route  /actions/home/:userId
// @access Private/Manager/Admin/Employee
const getUsersActionsDocumentsHandler = expressAsyncHandler(
  async (
    request: GetUsersActionsResourceRequest,
    response: Response<ActionsResourceRequestServerResponse>
  ) => {
    const {
      userInfo: { userId },
    } = request.body;
    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // assign userId to filter
    const filterWithUserId = { ...filter, userId };
    const pendingFilter = {
      ...filterWithUserId,
      requestStatus: { $in: ["pending"] },
    };

    const surveyOptions = {
      limit: 5,
      sort: { expiryDate: 1, _id: 1 },
      skip: 0,
    };
    const eventOptions = {
      limit: 5,
      sort: { eventStartDate: 1, _id: 1 },
      skip: 0,
    };

    const actionsCompanyData = await Promise.all([
      // repair notes
      getQueriedRepairTicketsService({
        filter: pendingFilter as FilterQuery<RepairTicketDocument> | undefined,
        projection: projection as QueryOptions<RepairTicketDocument>,
        options: options as QueryOptions<RepairTicketDocument>,
      }),
      // company data
      // address change
      getQueriedAddressChangesByUserService({
        filter: pendingFilter as FilterQuery<AddressChangeDocument> | undefined,
        projection: projection as QueryOptions<AddressChangeDocument>,
        options: options as QueryOptions<AddressChangeDocument>,
      }),
      // expense claim
      getQueriedExpenseClaimsByUserService({
        filter: pendingFilter as FilterQuery<ExpenseClaimDocument> | undefined,
        projection: projection as QueryOptions<ExpenseClaimDocument>,
        options: options as QueryOptions<ExpenseClaimDocument>,
      }),
      // request resource
      getQueriedRequestResourcesByUserService({
        filter: pendingFilter as FilterQuery<RequestResourceDocument> | undefined,
        projection: projection as QueryOptions<RequestResourceDocument>,
        options: options as QueryOptions<RequestResourceDocument>,
      }),
      // leave request
      getQueriedLeaveRequestsByUserService({
        filter: pendingFilter as FilterQuery<LeaveRequestDocument> | undefined,
        projection: projection as QueryOptions<LeaveRequestDocument>,
        options: options as QueryOptions<LeaveRequestDocument>,
      }),
      // benefits
      getQueriedBenefitsByUserService({
        filter: pendingFilter as FilterQuery<BenefitDocument> | undefined,
        projection: projection as QueryOptions<BenefitDocument>,
        options: options as QueryOptions<BenefitDocument>,
      }),

      // general data
      // endorsement
      getQueriedEndorsementsByUserService({
        filter: filterWithUserId as FilterQuery<EndorsementDocument> | undefined,
        projection: projection as QueryOptions<EndorsementDocument>,
        options: options as QueryOptions<EndorsementDocument>,
      }),
      // printer issue
      getQueriedPrinterIssuesByUserService({
        filter: pendingFilter as FilterQuery<PrinterIssueDocument> | undefined,
        projection: projection as QueryOptions<PrinterIssueDocument>,
        options: options as QueryOptions<PrinterIssueDocument>,
      }),
      // referment
      getQueriedRefermentsByUserService({
        filter: pendingFilter as FilterQuery<RefermentDocument> | undefined,
        projection: projection as QueryOptions<RefermentDocument>,
        options: options as QueryOptions<RefermentDocument>,
      }),

      // outreach data
      // announcement
      getQueriedAnnouncementsService({
        filter: filter as FilterQuery<AnnouncementDocument> | undefined,
        projection: projection as QueryOptions<AnnouncementDocument>,
        options: options as QueryOptions<AnnouncementDocument>,
      }),
      // survey
      getQueriedSurveysByUserService({
        filter: filter as FilterQuery<SurveyDocument> | undefined,
        projection: projection as QueryOptions<SurveyDocument>,
        options: surveyOptions as QueryOptions<SurveyDocument>,
      }),
      // event
      getQueriedEventsByUserService({
        filter: filter as FilterQuery<EventDocument> | undefined,
        projection: projection as QueryOptions<EventDocument>,
        options: eventOptions as QueryOptions<EventDocument>,
      }),
      // employees
      getQueriedUsersService({
        filter: filterWithUserId as FilterQuery<UserDocument> | undefined,
        projection: projection as QueryOptions<UserDocument>,
        options: eventOptions as QueryOptions<UserDocument>,
      }),
    ]);

    const [
      // repair notes
      repairTicketData,
      // company data
      addressChangeData,
      expenseClaimData,
      requestResourceData,
      leaveRequestData,
      benefitsData,
      // general data
      endorsementData,
      printerIssueData,
      refermentData,
      // outreach data
      announcementData,
      surveyData,
      eventData,
      // employees
      employeeData,
    ] = actionsCompanyData;

    response.status(200).json({
      message: "Successfully retrieved all company data",
      repairTicketData: repairTicketData.filter((data) => data),
      companyData: {
        addressChangeData: addressChangeData.filter((data) => data),
        expenseClaimData: expenseClaimData.filter((data) => data),
        requestResourceData: requestResourceData.filter((data) => data),
        leaveRequestData: leaveRequestData.filter((data) => data),
        benefitData: benefitsData.filter((data) => data),
      },
      generalData: {
        endorsementData: endorsementData.filter((data) => data),
        printerIssueData: printerIssueData.filter((data) => data),
        refermentData: refermentData.filter((data) => data),
      },
      outreachData: {
        announcementData: announcementData.filter((data) => data),
        surveyData: surveyData.filter((data) => data),
        eventData: eventData.filter((data) => data),
      },
      employeeData: employeeData.filter((data) => data),
    });
  }
);

export { getAllActionsDocumentsHandler, getUsersActionsDocumentsHandler };
