import expressAsyncController from "express-async-handler";
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
  getQueriedRequestResourcesByUserService,
  getQueriedRequestResourcesService,
  RequestResourceDocument,
} from "./company/requestResource";
import {
  getQueriedLeaveRequestsByUserService,
  getQueriedLeaveRequestsService,
  LeaveRequestDocument,
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
  getQueriedPrinterIssuesByUserService,
  getQueriedPrinterIssuesService,
  PrinterIssueDocument,
} from "./general/printerIssue";
import {
  AnonymousRequestDocument,
  getQueriedAnonymousRequestsService,
} from "./general/anonymousRequest";
import {
  getQueriedRefermentsByUserService,
  getQueriedRefermentsService,
  RefermentDocument,
} from "./general/referment";
import {
  AnnouncementDocument,
  getQueriedAnnouncementsService,
} from "./outreach/announcement";
import {
  getQueriedSurveysByUserService,
  getQueriedSurveysService,
  SurveyDocument,
} from "./outreach/survey";
import {
  EventDocument,
  getQueriedEventsByUserService,
  getQueriedEventsService,
} from "./outreach/event";
import {
  getQueriedRepairTicketsService,
  RepairTicketDocument,
} from "../repairTicket";
import { getQueriedUsersService, UserDocument } from "../user";
import { getAllUsersService } from "../user/user.service";
import { getAllCustomersService } from "../customer";

// @desc  get all actions company data
// @route  /actions/home
// @access Private/Manager/Admin
const getAllActionsDocumentsController = expressAsyncController(
  async (
    request: GetAllActionsResourceRequest,
    response: Response<ActionsResourceRequestServerResponse>,
  ) => {
    const { filter, projection, options } = request
      .query as QueryObjectParsedWithDefaults;

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
      getQueriedRepairTicketsService({
        filter: awaitingApprovalFilter as
          | FilterQuery<RepairTicketDocument>
          | undefined,
        projection: projection as QueryOptions<RepairTicketDocument>,
        options: options as QueryOptions<RepairTicketDocument>,
      }),

      getQueriedAddressChangesService({
        filter: pendingFilter as FilterQuery<AddressChangeDocument> | undefined,
        projection: projection as QueryOptions<AddressChangeDocument>,
        options: options as QueryOptions<AddressChangeDocument>,
      }),

      getQueriedExpenseClaimsService({
        filter: pendingFilter as FilterQuery<ExpenseClaimDocument> | undefined,
        projection: projection as QueryOptions<ExpenseClaimDocument>,
        options: options as QueryOptions<ExpenseClaimDocument>,
      }),

      getQueriedRequestResourcesService({
        filter: pendingFilter as
          | FilterQuery<RequestResourceDocument>
          | undefined,
        projection: projection as QueryOptions<RequestResourceDocument>,
        options: options as QueryOptions<RequestResourceDocument>,
      }),

      getQueriedLeaveRequestsService({
        filter: pendingFilter as FilterQuery<LeaveRequestDocument> | undefined,
        projection: projection as QueryOptions<LeaveRequestDocument>,
        options: options as QueryOptions<LeaveRequestDocument>,
      }),

      getQueriedBenefitsService({
        filter: pendingFilter as FilterQuery<BenefitDocument> | undefined,
        projection: projection as QueryOptions<BenefitDocument>,
        options: options as QueryOptions<BenefitDocument>,
      }),

      getQueriedEndorsementsService({
        filter: filter as FilterQuery<EndorsementDocument> | undefined,
        projection: projection as QueryOptions<EndorsementDocument>,
        options: options as QueryOptions<EndorsementDocument>,
      }),

      getQueriedPrinterIssuesService({
        filter: pendingFilter as FilterQuery<PrinterIssueDocument> | undefined,
        projection: projection as QueryOptions<PrinterIssueDocument>,
        options: options as QueryOptions<PrinterIssueDocument>,
      }),

      getQueriedAnonymousRequestsService({
        filter: pendingFilter as
          | FilterQuery<AnonymousRequestDocument>
          | undefined,
        projection: projection as QueryOptions<AnonymousRequestDocument>,
        options: options as QueryOptions<AnonymousRequestDocument>,
      }),

      getQueriedRefermentsService({
        filter: pendingFilter as FilterQuery<RefermentDocument> | undefined,
        projection: projection as QueryOptions<RefermentDocument>,
        options: options as QueryOptions<RefermentDocument>,
      }),

      getQueriedAnnouncementsService({
        filter: filter as FilterQuery<AnnouncementDocument> | undefined,
        projection: projection as QueryOptions<AnnouncementDocument>,
        options: options as QueryOptions<AnnouncementDocument>,
      }),

      getQueriedSurveysService({
        filter: filter as FilterQuery<SurveyDocument> | undefined,
        projection: projection as QueryOptions<SurveyDocument>,
        options: surveyOptions as QueryOptions<SurveyDocument>,
      }),

      getQueriedEventsService({
        filter: filter as FilterQuery<EventDocument> | undefined,
        projection: projection as QueryOptions<EventDocument>,
        options: eventOptions as QueryOptions<EventDocument>,
      }),

      getAllCustomersService(),

      getAllUsersService(),
    ]);

    const [
      repairTicketData,

      addressChangeData,
      expenseClaimData,
      requestResourceData,
      leaveRequestData,
      benefitsData,

      endorsementData,
      printerIssueData,
      anonymousRequestData,
      refermentData,

      announcementData,
      surveyData,
      eventData,

      customerData,

      employeeData,
    ] = actionsData;

    response.status(200).json({
      message: "Successfully retrieved all actions data",
      repairTicketData: repairTicketData.filter((data) => data),
      companyData: {
        // addressChangeData: addressChangeData.filter((data) => data),
        addressChangeData: [],
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
      customerData: customerData.filter((data) => data),
      employeeData: employeeData.filter((data) => data),
    });

    return;
  },
);

// @desc   get employee's actions company data
// @route  /actions/home/:userId
// @access Private/Manager/Admin/Employee
const getUsersActionsDocumentsController = expressAsyncController(
  async (
    request: GetUsersActionsResourceRequest,
    response: Response<ActionsResourceRequestServerResponse>,
  ) => {
    const {
      userInfo: { userId },
    } = request.body;
    const { filter, projection, options } = request
      .query as QueryObjectParsedWithDefaults;

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
      getQueriedRepairTicketsService({
        filter: pendingFilter as FilterQuery<RepairTicketDocument> | undefined,
        projection: projection as QueryOptions<RepairTicketDocument>,
        options: options as QueryOptions<RepairTicketDocument>,
      }),

      getQueriedAddressChangesByUserService({
        filter: pendingFilter as FilterQuery<AddressChangeDocument> | undefined,
        projection: projection as QueryOptions<AddressChangeDocument>,
        options: options as QueryOptions<AddressChangeDocument>,
      }),

      getQueriedExpenseClaimsByUserService({
        filter: pendingFilter as FilterQuery<ExpenseClaimDocument> | undefined,
        projection: projection as QueryOptions<ExpenseClaimDocument>,
        options: options as QueryOptions<ExpenseClaimDocument>,
      }),

      getQueriedRequestResourcesByUserService({
        filter: pendingFilter as
          | FilterQuery<RequestResourceDocument>
          | undefined,
        projection: projection as QueryOptions<RequestResourceDocument>,
        options: options as QueryOptions<RequestResourceDocument>,
      }),

      getQueriedLeaveRequestsByUserService({
        filter: pendingFilter as FilterQuery<LeaveRequestDocument> | undefined,
        projection: projection as QueryOptions<LeaveRequestDocument>,
        options: options as QueryOptions<LeaveRequestDocument>,
      }),

      getQueriedBenefitsByUserService({
        filter: pendingFilter as FilterQuery<BenefitDocument> | undefined,
        projection: projection as QueryOptions<BenefitDocument>,
        options: options as QueryOptions<BenefitDocument>,
      }),

      getQueriedEndorsementsByUserService({
        filter: filterWithUserId as
          | FilterQuery<EndorsementDocument>
          | undefined,
        projection: projection as QueryOptions<EndorsementDocument>,
        options: options as QueryOptions<EndorsementDocument>,
      }),

      getQueriedPrinterIssuesByUserService({
        filter: pendingFilter as FilterQuery<PrinterIssueDocument> | undefined,
        projection: projection as QueryOptions<PrinterIssueDocument>,
        options: options as QueryOptions<PrinterIssueDocument>,
      }),

      getQueriedRefermentsByUserService({
        filter: pendingFilter as FilterQuery<RefermentDocument> | undefined,
        projection: projection as QueryOptions<RefermentDocument>,
        options: options as QueryOptions<RefermentDocument>,
      }),

      getQueriedAnnouncementsService({
        filter: filter as FilterQuery<AnnouncementDocument> | undefined,
        projection: projection as QueryOptions<AnnouncementDocument>,
        options: options as QueryOptions<AnnouncementDocument>,
      }),

      getQueriedSurveysByUserService({
        filter: filter as FilterQuery<SurveyDocument> | undefined,
        projection: projection as QueryOptions<SurveyDocument>,
        options: surveyOptions as QueryOptions<SurveyDocument>,
      }),

      getQueriedEventsByUserService({
        filter: filter as FilterQuery<EventDocument> | undefined,
        projection: projection as QueryOptions<EventDocument>,
        options: eventOptions as QueryOptions<EventDocument>,
      }),

      getQueriedUsersService({
        filter: filterWithUserId as FilterQuery<UserDocument> | undefined,
        projection: projection as QueryOptions<UserDocument>,
        options: eventOptions as QueryOptions<UserDocument>,
      }),
    ]);

    const [
      repairTicketData,

      addressChangeData,
      expenseClaimData,
      requestResourceData,
      leaveRequestData,
      benefitsData,

      endorsementData,
      printerIssueData,
      refermentData,

      announcementData,
      surveyData,
      eventData,

      employeeData,
    ] = actionsCompanyData;

    response.status(200).json({
      message: "Successfully retrieved all company data",
      repairTicketData: repairTicketData.filter((data) => data),
      companyData: {
        // addressChangeData: addressChangeData.filter((data) => data),
        addressChangeData: [],
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
  },
);

export { getAllActionsDocumentsController, getUsersActionsDocumentsController };
