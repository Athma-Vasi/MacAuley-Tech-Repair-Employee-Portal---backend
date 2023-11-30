import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../../auth";
import { UserRoles } from "../../user";
import {
	DocumentUpdateOperation,
	GetQueriedResourceRequest,
} from "../../../types";

import {
	DesktopComputerDocument,
	DesktopComputerSchema,
} from "./desktopComputer.model";

interface CreateNewDesktopComputerRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		desktopComputerSchema: DesktopComputerSchema;
	};
}

// DEV ROUTE
interface CreateNewDesktopComputerBulkRequest
	extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		desktopComputerSchemas: DesktopComputerSchema[];
	};
}

// DEV ROUTE
interface UpdateDesktopComputersBulkRequest
	extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		desktopComputerFields: {
			documentId: Types.ObjectId;
			documentUpdate: DocumentUpdateOperation<DesktopComputerDocument>;
		}[];
	};
}

interface DeleteADesktopComputerRequest extends RequestAfterJWTVerification {
	params: { desktopComputerId: string };
}

type DeleteAllDesktopComputersRequest = RequestAfterJWTVerification;

type GetQueriedDesktopComputersRequest = GetQueriedResourceRequest;

interface GetDesktopComputerByIdRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
	};
	params: { desktopComputerId: string };
}

interface UpdateDesktopComputerByIdRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		documentUpdate: DocumentUpdateOperation<DesktopComputerDocument>;
	};
	params: { desktopComputerId: string };
}

export type {
	CreateNewDesktopComputerRequest,
	CreateNewDesktopComputerBulkRequest,
	DeleteADesktopComputerRequest,
	DeleteAllDesktopComputersRequest,
	GetDesktopComputerByIdRequest,
	GetQueriedDesktopComputersRequest,
	UpdateDesktopComputerByIdRequest,
	UpdateDesktopComputersBulkRequest,
};
