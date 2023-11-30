import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../../auth";
import { UserRoles } from "../../user";
import {
	DocumentUpdateOperation,
	GetQueriedResourceRequest,
} from "../../../types";

import { SmartphoneDocument, SmartphoneSchema } from "./smartphone.model";

interface CreateNewSmartphoneRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		smartphoneSchema: SmartphoneSchema;
	};
}

// DEV ROUTE
interface CreateNewSmartphoneBulkRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		smartphoneSchemas: SmartphoneSchema[];
	};
}

// DEV ROUTE
interface UpdateSmartphonesBulkRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		smartphoneFields: {
			documentId: Types.ObjectId;
			documentUpdate: DocumentUpdateOperation<SmartphoneDocument>;
		}[];
	};
}

interface DeleteASmartphoneRequest extends RequestAfterJWTVerification {
	params: { smartphoneId: string };
}

type DeleteAllSmartphonesRequest = RequestAfterJWTVerification;

type GetQueriedSmartphonesRequest = GetQueriedResourceRequest;

interface GetSmartphoneByIdRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
	};
	params: { smartphoneId: string };
}

interface UpdateSmartphoneByIdRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		documentUpdate: DocumentUpdateOperation<SmartphoneDocument>;
	};
	params: { smartphoneId: string };
}

export type {
	CreateNewSmartphoneRequest,
	CreateNewSmartphoneBulkRequest,
	DeleteASmartphoneRequest,
	DeleteAllSmartphonesRequest,
	GetSmartphoneByIdRequest,
	GetQueriedSmartphonesRequest,
	UpdateSmartphoneByIdRequest,
	UpdateSmartphonesBulkRequest,
};
