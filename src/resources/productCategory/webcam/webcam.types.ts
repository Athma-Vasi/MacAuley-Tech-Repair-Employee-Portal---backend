import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../../auth";
import { UserRoles } from "../../user";
import {
	DocumentUpdateOperation,
	GetQueriedResourceRequest,
} from "../../../types";

import { WebcamDocument, WebcamSchema } from "./webcam.model";

interface CreateNewWebcamRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		webcamFields: Omit<WebcamSchema, "userId" | "username">;
	};
}

// DEV ROUTE
interface CreateNewWebcamBulkRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		webcamSchemas: WebcamSchema[];
	};
}

// DEV ROUTE
interface UpdateWebcamsBulkRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		webcamFields: {
			webcamId: Types.ObjectId;
			documentUpdate: DocumentUpdateOperation<WebcamDocument>;
		}[];
	};
}

interface DeleteAWebcamRequest extends RequestAfterJWTVerification {
	params: { webcamId: string };
}

type DeleteAllWebcamsRequest = RequestAfterJWTVerification;

type GetQueriedWebcamsRequest = GetQueriedResourceRequest;

interface GetWebcamByIdRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
	};
	params: { webcamId: string };
}

interface UpdateWebcamByIdRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		documentUpdate: DocumentUpdateOperation<WebcamDocument>;
	};
	params: { webcamId: string };
}

export type {
	CreateNewWebcamRequest,
	CreateNewWebcamBulkRequest,
	DeleteAWebcamRequest,
	DeleteAllWebcamsRequest,
	GetWebcamByIdRequest,
	GetQueriedWebcamsRequest,
	UpdateWebcamByIdRequest,
	UpdateWebcamsBulkRequest,
};
