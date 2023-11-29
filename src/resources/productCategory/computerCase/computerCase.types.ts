import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../../auth";
import { UserRoles } from "../../user";
import {
	DocumentUpdateOperation,
	GetQueriedResourceRequest,
} from "../../../types";

import { ComputerCaseDocument, ComputerCaseSchema } from "./computerCase.model";

interface CreateNewComputerCaseRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		computerCaseFields: Omit<ComputerCaseSchema, "userId" | "username">;
	};
}

// DEV ROUTE
interface CreateNewComputerCaseBulkRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		computerCaseSchemas: ComputerCaseSchema[];
	};
}

// DEV ROUTE
interface UpdateComputerCasesBulkRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		computerCaseFields: {
			computerCaseId: Types.ObjectId;
			documentUpdate: DocumentUpdateOperation<ComputerCaseDocument>;
		}[];
	};
}

interface DeleteAComputerCaseRequest extends RequestAfterJWTVerification {
	params: { computerCaseId: string };
}

type DeleteAllComputerCasesRequest = RequestAfterJWTVerification;

type GetQueriedComputerCasesRequest = GetQueriedResourceRequest;

interface GetComputerCaseByIdRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
	};
	params: { computerCaseId: string };
}

interface UpdateComputerCaseByIdRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		documentUpdate: DocumentUpdateOperation<ComputerCaseDocument>;
	};
	params: { computerCaseId: string };
}

export type {
	CreateNewComputerCaseRequest,
	CreateNewComputerCaseBulkRequest,
	DeleteAComputerCaseRequest,
	DeleteAllComputerCasesRequest,
	GetComputerCaseByIdRequest,
	GetQueriedComputerCasesRequest,
	UpdateComputerCaseByIdRequest,
	UpdateComputerCasesBulkRequest,
};
