import {
  createNewResourceService,
  deleteManyResourcesService,
  getResourceByIdService,
  updateResourceByIdService,
} from "../../services";
import { createErrorLogSchema } from "../../utils";
import { AuthDocument, AuthModel } from "./auth.model";
import { TokenDecoded } from "./auth.types";
import { Request } from "express";
import { Err, Ok, Result } from "ts-results";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { ServiceOutput } from "../../types";
import { ErrorLogModel } from "../errorLog";

async function createTokenService(
  {
    decoded,
    expiresIn,
    request,
    seed,
  }: {
    decoded: TokenDecoded;
    expiresIn: string;
    request: Request;
    seed: string;
  },
): Promise<Result<ServiceOutput<string>, ServiceOutput>> {
  try {
    const {
      userInfo: { userId, roles, username },
      sessionId,
      jti,
    } = decoded;

    const getSessionResult = await getResourceByIdService(
      sessionId.toString(),
      AuthModel,
    );

    if (getSessionResult.err) {
      await createNewResourceService(
        createErrorLogSchema(
          getSessionResult.val,
          request.body,
        ),
        ErrorLogModel,
      );

      return new Err({ kind: "error" });
    }

    const existingSession = getSessionResult.safeUnwrap().data as
      | AuthDocument
      | undefined;

    if (existingSession === undefined) {
      return new Err({ kind: "error" });
    }

    const isTokenInDenyList = existingSession.tokensDenyList
      .includes(
        jti,
      );

    if (isTokenInDenyList) {
      // invalidate all sessions
      const deleteManyResult = await deleteManyResourcesService({
        filter: { userId },
        model: AuthModel,
      });

      if (deleteManyResult.err) {
        await createNewResourceService(
          createErrorLogSchema(
            deleteManyResult.val,
            request.body,
          ),
          ErrorLogModel,
        );
      }

      return new Err({ kind: "error" });
    }

    // if token has not been used and session exists,
    // add old token jti to deny list
    const updateSessionResult = await updateResourceByIdService({
      resourceId: sessionId.toString(),
      fields: { tokensDenyList: jti },
      model: AuthModel,
      updateOperator: "$push",
    });

    if (updateSessionResult.err) {
      await createNewResourceService(
        createErrorLogSchema(
          updateSessionResult.val,
          request.body,
        ),
        ErrorLogModel,
      );

      return new Err({ kind: "error" });
    }

    const newTokenJti = uuidv4();
    const refreshToken = jwt.sign(
      {
        userInfo: {
          userId,
          username,
          roles,
        },
        sessionId,
      },
      seed,
      {
        expiresIn,
        jwtid: newTokenJti,
      },
    );

    return new Ok({ data: refreshToken, kind: "success" });
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
