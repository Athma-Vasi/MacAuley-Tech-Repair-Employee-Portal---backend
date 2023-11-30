import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../../auth";
import { UserRoles } from "../../user";
import {
	DocumentUpdateOperation,
	GetQueriedResourceRequest,
} from "../../../types";

import { SpeakerDocument, SpeakerSchema } from "./speaker.model";

interface CreateNewSpeakerRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		speakerSchema: SpeakerSchema;
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

// DEV ROUTE
interface UpdateSpeakersBulkRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		speakerFields: {
			documentId: Types.ObjectId;
			documentUpdate: DocumentUpdateOperation<SpeakerDocument>;
		}[];
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
		documentUpdate: DocumentUpdateOperation<SpeakerDocument>;
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
	UpdateSpeakersBulkRequest,
};
