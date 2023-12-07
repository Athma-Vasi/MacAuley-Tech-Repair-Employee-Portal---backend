import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../../../auth";
import type { UserRoles } from "../../../user";
import {
  DocumentUpdateOperation,
  GetQueriedResourceByUserRequest,
  GetQueriedResourceRequest,
} from "../../../../types";
import { BenefitDocument, BenefitSchema } from "./benefit.model";

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body
interface CreateNewBenefitRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    benefitFields: Omit<BenefitSchema, "userId" | "username">;
  };
}

interface DeleteAnBenefitRequest extends RequestAfterJWTVerification {
  params: {
    benefitId: string;
  };
}

type DeleteAllBenefitsRequest = RequestAfterJWTVerification;

type GetQueriedBenefitsByUserRequest = GetQueriedResourceByUserRequest;

interface GetBenefitByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    newQueryFlag: boolean;
    totalDocuments: number;
  };
  query: {
    projection: string | string[] | Record<string, any>;
    options: Record<string, any>;
    filter: Record<string, any>;
  };
  params: { benefitId: string };
}

interface UpdateBenefitByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    documentUpdate: DocumentUpdateOperation<BenefitDocument>;
  };
  params: { benefitId: string };
}

type GetQueriedBenefitsRequest = GetQueriedResourceRequest;

// DEV ROUTE
interface CreateNewBenefitsBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    benefitSchemas: BenefitSchema[];
  };
}

// DEV ROUTE
interface UpdateBenefitsBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    benefitFields: {
      benefitId: Types.ObjectId;
      documentUpdate: DocumentUpdateOperation<BenefitDocument>;
    }[];
  };
}

export type {
  CreateNewBenefitRequest,
  DeleteAnBenefitRequest,
  DeleteAllBenefitsRequest,
  GetQueriedBenefitsByUserRequest,
  GetBenefitByIdRequest,
  GetQueriedBenefitsRequest,
  UpdateBenefitByIdRequest,
  CreateNewBenefitsBulkRequest,
  UpdateBenefitsBulkRequest,
};
