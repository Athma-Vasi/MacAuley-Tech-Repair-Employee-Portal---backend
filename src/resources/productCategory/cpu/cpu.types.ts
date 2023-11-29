import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../../auth";
import { UserRoles } from "../../user";
import {
	DocumentUpdateOperation,
	GetQueriedResourceRequest,
} from "../../../types";

import { CpuDocument, CpuSchema } from "./cpu.model";

interface CreateNewCpuRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		cpuFields: Omit<CpuSchema, "userId" | "username">;
	};
}

// DEV ROUTE
interface CreateNewCpuBulkRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		cpuSchemas: CpuSchema[];
	};
}

// DEV ROUTE
interface UpdateCpusBulkRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		cpuFields: {
			cpuId: Types.ObjectId;
			documentUpdate: DocumentUpdateOperation<CpuDocument>;
		}[];
	};
}

interface DeleteACpuRequest extends RequestAfterJWTVerification {
	params: { cpuId: string };
}

type DeleteAllCpusRequest = RequestAfterJWTVerification;

type GetQueriedCpusRequest = GetQueriedResourceRequest;

interface GetCpuByIdRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
	};
	params: { cpuId: string };
}

interface UpdateCpuByIdRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		documentUpdate: DocumentUpdateOperation<CpuDocument>;
	};
	params: { cpuId: string };
}

export type {
	CreateNewCpuRequest,
	CreateNewCpuBulkRequest,
	DeleteACpuRequest,
	DeleteAllCpusRequest,
	GetCpuByIdRequest,
	GetQueriedCpusRequest,
	UpdateCpuByIdRequest,
	UpdateCpusBulkRequest,
};
