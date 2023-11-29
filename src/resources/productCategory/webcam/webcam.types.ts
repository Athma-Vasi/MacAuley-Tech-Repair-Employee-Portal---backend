import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../../auth";
import { UserRoles } from "../../user";
import { GetQueriedResourceRequest } from "../../../types";

import { FileUploadDocument } from "../../fileUpload";
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
		webcamFields: Record<keyof WebcamSchema, WebcamSchema[keyof WebcamSchema]>;
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
};
