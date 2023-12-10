import { RequestAfterJWTVerificationWithQuery } from "../auth/auth.types";

type GetUsernameEmailExistsRequest = RequestAfterJWTVerificationWithQuery & {
  body: {
    fields: {
      username?: string;
      email?: string;
    };
  };
};

/**
 * @description only runs once to create the document (only one document exists in collection)
 */
type PostUsernameEmailSetRequest = RequestAfterJWTVerificationWithQuery & {
  body: {
    username: string[];
    email: string[];
  };
};

type UsernameEmailSetResponse = {
  status: "error" | "success";
  message: string;
};

export type {
  GetUsernameEmailExistsRequest,
  UsernameEmailSetResponse,
  PostUsernameEmailSetRequest,
};
