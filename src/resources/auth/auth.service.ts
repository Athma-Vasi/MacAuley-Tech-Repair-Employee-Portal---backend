import { Request } from "express";
import jwt from "jsonwebtoken";
import { Err, Ok, Result } from "ts-results";
import {
  createNewResourceService,
  deleteManyResourcesService,
  getResourceByIdService,
  updateResourceByIdService,
} from "../../services";
import { DecodedToken, ServiceOutput } from "../../types";
import { createErrorLogSchema } from "../../utils";
import { ErrorLogModel } from "../errorLog";
import { AuthDocument, AuthModel, AuthSchema } from "./auth.model";

async function createTokenService(
  {
    decodedOldToken,
    expiresIn,
    invalidateOldToken = false,
    request,
    seed,
  }: {
    decodedOldToken: DecodedToken;
    expiresIn: string;
    invalidateOldToken?: boolean;
    request: Request;
    seed: string;
  },
): Promise<Result<ServiceOutput<string>, ServiceOutput>> {
  try {
    const {
      userInfo: { userId, roles, username },
      sessionId,
    } = decodedOldToken;

    const getSessionResult = await getResourceByIdService(
      sessionId.toString(),
      AuthModel,
    );

    console.log(`\n`);
    console.group("createTokenService");
    console.log("decodedOldToken:", JSON.stringify(decodedOldToken, null, 2));
    console.log("getSessionResult:", getSessionResult);

    if (getSessionResult.err) {
      await createNewResourceService(
        createErrorLogSchema(
          getSessionResult.val,
          request.body,
        ),
        ErrorLogModel,
      );

      return new Err({ kind: "error", message: "Error getting session" });
    }

    const existingSession = getSessionResult.safeUnwrap().data as
      | AuthDocument
      | undefined;

    if (existingSession === undefined) {
      return new Err({ kind: "error", message: "Session not found" });
    }

    console.log("existingSession:", existingSession);

    if (!existingSession.isValid) {
      // invalidate all sessions for this user
      const deleteManyResult = await deleteManyResourcesService({
        filter: { userId },
        model: AuthModel,
      });

      console.log("invalidating all sessions");
      console.log("deleteManyResult:", deleteManyResult);

      if (deleteManyResult.err) {
        await createNewResourceService(
          createErrorLogSchema(
            deleteManyResult.val,
            request.body,
          ),
          ErrorLogModel,
        );
      }

      return new Err({ kind: "error", message: "Session invalid" });
    }

    // if token is being refreshed, revoke validity of existing session
    if (invalidateOldToken) {
      const updateSessionResult = await updateResourceByIdService({
        resourceId: sessionId.toString(),
        fields: { isValid: false },
        model: AuthModel,
        updateOperator: "$set",
      });

      console.log("updateSessionResult:", updateSessionResult);

      if (updateSessionResult.err) {
        await createNewResourceService(
          createErrorLogSchema(
            updateSessionResult.val,
            request.body,
          ),
          ErrorLogModel,
        );

        return new Err({ kind: "error", message: "Error updating session" });
      }
    }

    const authSessionSchema: AuthSchema = {
      addressIP: request.ip ?? "",
      // user will be required to log in their session again after 1 day
      expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1),
      isValid: true,
      userAgent: request.get("User-Agent") ?? "",
      userId,
      username,
    };

    const createAuthSessionResult = await createNewResourceService(
      authSessionSchema,
      AuthModel,
    );

    if (createAuthSessionResult.err) {
      await createNewResourceService(
        createErrorLogSchema(createAuthSessionResult.val, request.body),
        ErrorLogModel,
      );

      return new Err({ kind: "error", message: "Error creating session" });
    }

    const newSessionId = createAuthSessionResult.safeUnwrap().data?._id;

    if (!newSessionId) {
      return new Err({ kind: "error", message: "No session ID" });
    }

    const newAccessToken = jwt.sign(
      { userInfo: { userId, username, roles }, sessionId: newSessionId },
      seed,
      { expiresIn },
    );

    console.groupEnd();

    return new Ok({ data: newAccessToken, kind: "success" });
  } catch (error: unknown) {
    await createNewResourceService(
      createErrorLogSchema(
        error,
        request.body,
      ),
      ErrorLogModel,
    );

    return new Err({ kind: "error" });
  }
}

export { createTokenService };
