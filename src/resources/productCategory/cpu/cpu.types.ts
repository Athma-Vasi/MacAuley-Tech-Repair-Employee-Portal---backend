import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../../auth";
import { UserRoles } from "../../user";
import { GetQueriedResourceRequest } from "../../../types";

import { CpuSchema } from "./cpu.model";

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
		cpuFields: Record<keyof CpuSchema, CpuSchema[keyof CpuSchema]>;
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
};
