import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../../auth";
import { UserRoles } from "../../user";
import { GetQueriedResourceRequest } from "../../../types";

import { FileUploadDocument } from "../../fileUpload";
import { SpeakerDocument, SpeakerSchema } from "./speaker.model";

interface CreateNewSpeakerRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		speakerFields: Omit<SpeakerSchema, "userId" | "username">;
	};
}

// DEV ROUTE
interface CreateNewSpeakerBulkRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		speakerSchemas: SpeakerSchema[];
	};
}

interface DeleteASpeakerRequest extends RequestAfterJWTVerification {
	params: { speakerId: string };
}

type DeleteAllSpeakersRequest = RequestAfterJWTVerification;

type GetQueriedSpeakersRequest = GetQueriedResourceRequest;

interface GetSpeakerByIdRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
	};
	params: { speakerId: string };
}

interface UpdateSpeakerByIdRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		speakerFields: Record<
			keyof SpeakerSchema,
			SpeakerSchema[keyof SpeakerSchema]
		>;
	};
	params: { speakerId: string };
}

export type {
	CreateNewSpeakerRequest,
	CreateNewSpeakerBulkRequest,
	DeleteASpeakerRequest,
	DeleteAllSpeakersRequest,
	GetSpeakerByIdRequest,
	GetQueriedSpeakersRequest,
	UpdateSpeakerByIdRequest,
};
