import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../../auth";
import { UserRoles } from "../../user";
import {
	DocumentUpdateOperation,
	GetQueriedResourceRequest,
} from "../../../types";

import { LaptopDocument, LaptopSchema } from "./laptop.model";

interface CreateNewLaptopRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		laptopSchema: LaptopSchema;
	};
}

// DEV ROUTE
interface CreateNewLaptopBulkRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		laptopSchemas: LaptopSchema[];
	};
}

// DEV ROUTE
interface UpdateLaptopsBulkRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		laptopFields: {
			documentId: Types.ObjectId;
			documentUpdate: DocumentUpdateOperation<LaptopDocument>;
		}[];
	};
}

interface DeleteALaptopRequest extends RequestAfterJWTVerification {
	params: { laptopId: string };
}

type DeleteAllLaptopsRequest = RequestAfterJWTVerification;

type GetQueriedLaptopsRequest = GetQueriedResourceRequest;

interface GetLaptopByIdRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
	};
	params: { laptopId: string };
}

interface UpdateLaptopByIdRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		documentUpdate: DocumentUpdateOperation<LaptopDocument>;
	};
	params: { laptopId: string };
}

export type {
	CreateNewLaptopRequest,
	CreateNewLaptopBulkRequest,
	DeleteALaptopRequest,
	DeleteAllLaptopsRequest,
	GetLaptopByIdRequest,
	GetQueriedLaptopsRequest,
	UpdateLaptopByIdRequest,
	UpdateLaptopsBulkRequest,
};
