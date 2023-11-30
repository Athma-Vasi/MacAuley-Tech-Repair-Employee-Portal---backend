import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../../auth";
import { UserRoles } from "../../user";
import {
	DocumentUpdateOperation,
	GetQueriedResourceRequest,
} from "../../../types";

import { PsuDocument, PsuSchema } from "./psu.model";

interface CreateNewPsuRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		psuSchema: PsuSchema;
	};
}

// DEV ROUTE
interface CreateNewPsuBulkRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		psuSchemas: PsuSchema[];
	};
}

// DEV ROUTE
interface UpdatePsusBulkRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		psuFields: {
			documentId: Types.ObjectId;
			documentUpdate: DocumentUpdateOperation<PsuDocument>;
		}[];
	};
}

interface DeleteAPsuRequest extends RequestAfterJWTVerification {
	params: { psuId: string };
}

type DeleteAllPsusRequest = RequestAfterJWTVerification;

type GetQueriedPsusRequest = GetQueriedResourceRequest;

interface GetPsuByIdRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
	};
	params: { psuId: string };
}

interface UpdatePsuByIdRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		documentUpdate: DocumentUpdateOperation<PsuDocument>;
	};
	params: { psuId: string };
}

export type {
	CreateNewPsuRequest,
	CreateNewPsuBulkRequest,
	DeleteAPsuRequest,
	DeleteAllPsusRequest,
	GetPsuByIdRequest,
	GetQueriedPsusRequest,
	UpdatePsuByIdRequest,
	UpdatePsusBulkRequest,
};
