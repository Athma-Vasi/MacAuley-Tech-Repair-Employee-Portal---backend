import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../../auth";
import { UserRoles } from "../../user";
import {
	DocumentUpdateOperation,
	GetQueriedResourceRequest,
} from "../../../types";

import { GpuDocument, GpuSchema } from "./gpu.model";

interface CreateNewGpuRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		gpuFields: Omit<GpuSchema, "userId" | "username">;
	};
}

// DEV ROUTE
interface CreateNewGpuBulkRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		gpuSchemas: GpuSchema[];
	};
}

// DEV ROUTE
interface UpdateGpusBulkRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		gpuFields: {
			gpuId: Types.ObjectId;
			documentUpdate: DocumentUpdateOperation<GpuDocument>;
		}[];
	};
}

interface DeleteAGpuRequest extends RequestAfterJWTVerification {
	params: { gpuId: string };
}

type DeleteAllGpusRequest = RequestAfterJWTVerification;

type GetQueriedGpusRequest = GetQueriedResourceRequest;

interface GetGpuByIdRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
	};
	params: { gpuId: string };
}

interface UpdateGpuByIdRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		documentUpdate: DocumentUpdateOperation<GpuDocument>;
	};
	params: { gpuId: string };
}

export type {
	CreateNewGpuRequest,
	CreateNewGpuBulkRequest,
	DeleteAGpuRequest,
	DeleteAllGpusRequest,
	GetGpuByIdRequest,
	GetQueriedGpusRequest,
	UpdateGpuByIdRequest,
	UpdateGpusBulkRequest,
};
