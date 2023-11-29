import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../../auth";
import { UserRoles } from "../../user";
import {
	DocumentUpdateOperation,
	GetQueriedResourceRequest,
} from "../../../types";

import { MicrophoneDocument, MicrophoneSchema } from "./microphone.model";

interface CreateNewMicrophoneRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		microphoneFields: Omit<MicrophoneSchema, "userId" | "username">;
	};
}

// DEV ROUTE
interface CreateNewMicrophoneBulkRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		microphoneSchemas: MicrophoneSchema[];
	};
}

// DEV ROUTE
interface UpdateMicrophonesBulkRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		microphoneFields: {
			microphoneId: Types.ObjectId;
			documentUpdate: DocumentUpdateOperation<MicrophoneDocument>;
		}[];
	};
}

interface DeleteAMicrophoneRequest extends RequestAfterJWTVerification {
	params: { microphoneId: string };
}

type DeleteAllMicrophonesRequest = RequestAfterJWTVerification;

type GetQueriedMicrophonesRequest = GetQueriedResourceRequest;

interface GetMicrophoneByIdRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
	};
	params: { microphoneId: string };
}

interface UpdateMicrophoneByIdRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		documentUpdate: DocumentUpdateOperation<MicrophoneDocument>;
	};
	params: { microphoneId: string };
}

export type {
	CreateNewMicrophoneRequest,
	CreateNewMicrophoneBulkRequest,
	DeleteAMicrophoneRequest,
	DeleteAllMicrophonesRequest,
	GetMicrophoneByIdRequest,
	GetQueriedMicrophonesRequest,
	UpdateMicrophoneByIdRequest,
	UpdateMicrophonesBulkRequest,
};
