import expressAsyncHandler from 'express-async-handler';
import {
  ActionsResourceRequestServerResponse,
  GetAllActionsResourceRequest,
  GetUsersActionsResourceRequest,
} from './actions.types';
import { Response } from 'express';
import {
  AddressChangeDocument,
  getQueriedAddressChangesByUserService,
  getQueriedAddressChangesService,
} from './company/addressChange';
import { QueryObjectParsedWithDefaults } from '../../types';
import { FilterQuery, QueryOptions } from 'mongoose';
import {
  ExpenseClaimDocument,
  getQueriedExpenseClaimsByUserService,
  getQueriedExpenseClaimsService,
} from './company/expenseClaim';
import {
  RequestResourceDocument,
  getQueriedRequestResourceByUserService,
  getQueriedRequestResourceService,
} from './company/requestResource';
import {
  LeaveRequestDocument,
  getQueriedLeaveRequestsByUserService,
  getQueriedLeaveRequestsService,
} from './company/leaveRequest';
import {
  BenefitsDocument,
  getQueriedBenefitsByUserService,
  getQueriedBenefitsService,
} from './company/benefits';
import {
  getQueriedEndorsementsByUserService,
  getQueriedEndorsementsService,
} from './general/endorsement';
import {
  getQueriedPrinterIssuesByUserService,
  getQueriedPrinterIssuesService,
} from './general/printerIssue';
import { getQueriedAnonymousRequestsService } from './general/anonymousRequest';
import {
  getQueriedRefermentsByUserService,
  getQueriedRefermentsService,
} from './general/referment';
import { getQueriedAnnouncementsService } from './outreach/announcement';
import { getQueriedSurveysByUserService, getQueriedSurveysService } from './outreach/survey';
import { getQueriedEventsByUserService, getQueriedEventsService } from './outreach/event';

// @desc  get all actions company data
// @route  /actions/dashboard
// @access Private/Manager/Admin
const getAllActionsDocumentsHandler = expressAsyncHandler(
  async (
    request: GetAllActionsResourceRequest,
    response: Response<ActionsResourceRequestServerResponse>
  ) => {
    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    const actionsData = await Promise.all([
      // company data
      // address change
      getQueriedAddressChangesService({
        filter: filter as FilterQuery<AddressChangeDocument> | undefined,
        projection: projection as QueryOptions<AddressChangeDocument>,
        options: options as QueryOptions<AddressChangeDocument>,
      }),
      // expense claim
      getQueriedExpenseClaimsService({
        filter: filter as FilterQuery<ExpenseClaimDocument> | undefined,
        projection: projection as QueryOptions<ExpenseClaimDocument>,
        options: options as QueryOptions<ExpenseClaimDocument>,
      }),
      // request resource
      getQueriedRequestResourceService({
        filter: filter as FilterQuery<RequestResourceDocument> | undefined,
        projection: projection as QueryOptions<RequestResourceDocument>,
        options: options as QueryOptions<RequestResourceDocument>,
      }),
      // leave request
      getQueriedLeaveRequestsService({
        filter: filter as FilterQuery<LeaveRequestDocument> | undefined,
        projection: projection as QueryOptions<LeaveRequestDocument>,
        options: options as QueryOptions<LeaveRequestDocument>,
      }),
      // benefits
      getQueriedBenefitsService({
        filter: filter as FilterQuery<BenefitsDocument> | undefined,
        projection: projection as QueryOptions<BenefitsDocument>,
        options: options as QueryOptions<BenefitsDocument>,
      }),

      // general data
      // endorsement
      getQueriedEndorsementsService({
        filter: filter as FilterQuery<BenefitsDocument> | undefined,
        projection: projection as QueryOptions<BenefitsDocument>,
        options: options as QueryOptions<BenefitsDocument>,
      }),
      // printer issue
      getQueriedPrinterIssuesService({
        filter: filter as FilterQuery<BenefitsDocument> | undefined,
        projection: projection as QueryOptions<BenefitsDocument>,
        options: options as QueryOptions<BenefitsDocument>,
      }),
      // anonymous request
      getQueriedAnonymousRequestsService({
        filter: filter as FilterQuery<BenefitsDocument> | undefined,
        projection: projection as QueryOptions<BenefitsDocument>,
        options: options as QueryOptions<BenefitsDocument>,
      }),
      // referment
      getQueriedRefermentsService({
        filter: filter as FilterQuery<BenefitsDocument> | undefined,
        projection: projection as QueryOptions<BenefitsDocument>,
        options: options as QueryOptions<BenefitsDocument>,
      }),

      // outreach data
      // announcement
      getQueriedAnnouncementsService({
        filter: filter as FilterQuery<BenefitsDocument> | undefined,
        projection: projection as QueryOptions<BenefitsDocument>,
        options: options as QueryOptions<BenefitsDocument>,
      }),
      // survey
      getQueriedSurveysService({
        filter: filter as FilterQuery<BenefitsDocument> | undefined,
        projection: projection as QueryOptions<BenefitsDocument>,
        options: options as QueryOptions<BenefitsDocument>,
      }),
      // event
      getQueriedEventsService({
        filter: filter as FilterQuery<BenefitsDocument> | undefined,
        projection: projection as QueryOptions<BenefitsDocument>,
        options: options as QueryOptions<BenefitsDocument>,
      }),
    ]);

    const [
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
    ] = actionsData;

    response.status(200).json({
      message: 'Successfully retrieved all actions data',
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
    });
  }
);

// @desc   get employee's actions company data
// @route  /actions/dashboard/:userId
// @access Private/Manager/Admin/Employee
const getUsersActionsDocumentsHandler = expressAsyncHandler(
  async (
    request: GetUsersActionsResourceRequest,
    response: Response<ActionsResourceRequestServerResponse>
  ) => {
    const {
      userInfo: { userId },
    } = request.body;
    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // assign userId to filter
    const filterWithUserId = { ...filter, userId };

    const actionsCompanyData = await Promise.all([
      // company data
      // address change
      getQueriedAddressChangesByUserService({
        filter: filterWithUserId as FilterQuery<AddressChangeDocument> | undefined,
        projection: projection as QueryOptions<AddressChangeDocument>,
        options: options as QueryOptions<AddressChangeDocument>,
      }),
      // expense claim
      getQueriedExpenseClaimsByUserService({
        filter: filterWithUserId as FilterQuery<ExpenseClaimDocument> | undefined,
        projection: projection as QueryOptions<ExpenseClaimDocument>,
        options: options as QueryOptions<ExpenseClaimDocument>,
      }),
      // request resource
      getQueriedRequestResourceByUserService({
        filter: filterWithUserId as FilterQuery<RequestResourceDocument> | undefined,
        projection: projection as QueryOptions<RequestResourceDocument>,
        options: options as QueryOptions<RequestResourceDocument>,
      }),
      // leave request
      getQueriedLeaveRequestsByUserService({
        filter: filterWithUserId as FilterQuery<LeaveRequestDocument> | undefined,
        projection: projection as QueryOptions<LeaveRequestDocument>,
        options: options as QueryOptions<LeaveRequestDocument>,
      }),
      // benefits
      getQueriedBenefitsByUserService({
        filter: filterWithUserId as FilterQuery<BenefitsDocument> | undefined,
        projection: projection as QueryOptions<BenefitsDocument>,
        options: options as QueryOptions<BenefitsDocument>,
      }),

      // general data
      // endorsement
      getQueriedEndorsementsByUserService({
        filter: filterWithUserId as FilterQuery<BenefitsDocument> | undefined,
        projection: projection as QueryOptions<BenefitsDocument>,
        options: options as QueryOptions<BenefitsDocument>,
      }),
      // printer issue
      getQueriedPrinterIssuesByUserService({
        filter: filterWithUserId as FilterQuery<BenefitsDocument> | undefined,
        projection: projection as QueryOptions<BenefitsDocument>,
        options: options as QueryOptions<BenefitsDocument>,
      }),
      // referment
      getQueriedRefermentsByUserService({
        filter: filterWithUserId as FilterQuery<BenefitsDocument> | undefined,
        projection: projection as QueryOptions<BenefitsDocument>,
        options: options as QueryOptions<BenefitsDocument>,
      }),

      // outreach data
      // announcement
      getQueriedAnnouncementsService({
        filter: filter as FilterQuery<BenefitsDocument> | undefined,
        projection: projection as QueryOptions<BenefitsDocument>,
        options: options as QueryOptions<BenefitsDocument>,
      }),
      // survey
      getQueriedSurveysByUserService({
        filter: filter as FilterQuery<BenefitsDocument> | undefined,
        projection: projection as QueryOptions<BenefitsDocument>,
        options: options as QueryOptions<BenefitsDocument>,
      }),
      // event
      getQueriedEventsByUserService({
        filter: filter as FilterQuery<BenefitsDocument> | undefined,
        projection: projection as QueryOptions<BenefitsDocument>,
        options: options as QueryOptions<BenefitsDocument>,
      }),
    ]);

    const [
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
    ] = actionsCompanyData;

    response.status(200).json({
      message: 'Successfully retrieved all company data',
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
    });
  }
);

export { getAllActionsDocumentsHandler, getUsersActionsDocumentsHandler };
