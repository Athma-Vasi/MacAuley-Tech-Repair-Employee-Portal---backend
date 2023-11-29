import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../../auth";
import { UserRoles } from "../../user";
import {
	DocumentUpdateOperation,
	GetQueriedResourceRequest,
} from "../../../types";

import { RamDocument, RamSchema } from "./ram.model";

interface CreateNewRamRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		ramFields: Omit<RamSchema, "userId" | "username">;
	};
}

// DEV ROUTE
interface CreateNewRamBulkRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		ramSchemas: RamSchema[];
	};
}

// DEV ROUTE
interface UpdateRamsBulkRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		ramFields: {
			ramId: Types.ObjectId;
			documentUpdate: DocumentUpdateOperation<RamDocument>;
		}[];
	};
}

interface DeleteARamRequest extends RequestAfterJWTVerification {
	params: { ramId: string };
}

type DeleteAllRamsRequest = RequestAfterJWTVerification;

type GetQueriedRamsRequest = GetQueriedResourceRequest;

interface GetRamByIdRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
	};
	params: { ramId: string };
}

interface UpdateRamByIdRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		documentUpdate: DocumentUpdateOperation<RamDocument>;
	};
	params: { ramId: string };
}

export type {
	CreateNewRamRequest,
	CreateNewRamBulkRequest,
	DeleteARamRequest,
	DeleteAllRamsRequest,
	GetRamByIdRequest,
	GetQueriedRamsRequest,
	UpdateRamByIdRequest,
	UpdateRamsBulkRequest,
};
