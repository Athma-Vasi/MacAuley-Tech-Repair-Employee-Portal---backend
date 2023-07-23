import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../auth';
import { Country, PostalCode, Province, StatesUS, UserRoles } from '../user';
import { Urgency } from '../actions/general/printerIssue';
import { RequiredRepairs, PartsNeeded, RepairStatus } from './repairNote.model';
import { GetQueriedResourceRequest } from '../../types';

interface CreateNewRepairNoteRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    repairNote: {
      // part information
      partName: string;
      partSerialId: string;
      dateReceived: Date;
      descriptionOfIssue: string;
      initialInspectionNotes: string;

      // customer information
      customerName: string;
      customerPhone: string;
      customerEmail: string;
      customerAddressLine: string;
      customerCity: string;
      customerState: StatesUS;
      customerProvince: Province;
      customerCountry: Country;
      customerPostalCode: PostalCode;

      // repair information
      requiredRepairs: RequiredRepairs[];
      partsNeeded: PartsNeeded[];
      partsNeededModels: string;
      partUnderWarranty: boolean;
      estimatedRepairCost: number;
      estimatedCompletionDate: Date;
      repairPriority: Urgency;
      workOrderId: string; // generated by the system

      /** ongoing and final (updated) repair note state added after */
    };
  };
}

interface DeleteARepairNoteRequest extends RequestAfterJWTVerification {
  params: {
    repairNoteId: string;
  };
}

type DeleteAllRepairNotesRequest = RequestAfterJWTVerification;

type GetQueriedRepairNotesByUserRequest = GetQueriedResourceRequest;

type GetQueriedRepairNotesRequest = GetQueriedResourceRequest;

interface GetRepairNoteByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
  };
  params: { repairNoteId: string };
}

interface UpdateRepairNoteByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    repairNote: {
      // part information
      partName: string;
      partSerialId: string;
      dateReceived: Date;
      descriptionOfIssue: string;
      initialInspectionNotes: string;

      // customer information
      customerName: string;
      customerPhone: string;
      customerEmail: string;
      customerAddressLine: string;
      customerCity: string;
      customerState: StatesUS;
      customerProvince: Province;
      customerCountry: Country;
      customerPostalCode: PostalCode;

      // repair information
      requiredRepairs: RequiredRepairs[];
      partsNeeded: PartsNeeded[];
      partsNeededModels: string;
      partUnderWarranty: boolean;
      estimatedRepairCost: number;
      estimatedCompletionDate: Date;
      repairPriority: Urgency;
      workOrderId: string; // generated by the system

      /** ongoing and final (updated) repair note state added after */
      repairNotes: string;
      testingResults: string;
      finalRepairCost: number;
      repairStatus: RepairStatus;
    };
  };
}

export type {
  CreateNewRepairNoteRequest,
  DeleteARepairNoteRequest,
  DeleteAllRepairNotesRequest,
  GetQueriedRepairNotesByUserRequest,
  GetRepairNoteByIdRequest,
  GetQueriedRepairNotesRequest,
  UpdateRepairNoteByIdRequest,
};
