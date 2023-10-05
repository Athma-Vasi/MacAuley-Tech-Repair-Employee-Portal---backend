import { Types } from 'mongoose';
import { AuthModel, AuthSchema } from './auth.model';
import type { DeleteResult } from 'mongodb';

async function createNewAuthSessionService(authSchema: AuthSchema) {
  try {
    const newAuthSession = await AuthModel.create(authSchema);

    return newAuthSession;
  } catch (error: any) {
    throw new Error(error, { cause: 'auth.service.ts -> createNewAuthSessionService()' });
  }
}

async function findSessionByIdService(sessionId: Types.ObjectId | string) {
  try {
    const authSession = await AuthModel.findOne({ _id: sessionId });

    return authSession;
  } catch (error: any) {
    throw new Error(error, { cause: 'auth.service.ts -> findSessionByIdService()' });
  }
}

async function updateSessionRefreshTokenDenyListService({
  sessionId,
  refreshTokenJwtId,
}: {
  sessionId: Types.ObjectId | string;
  refreshTokenJwtId: string;
}): Promise<void> {
  try {
    await AuthModel.findOneAndUpdate(
      { _id: sessionId },
      { $push: { refreshTokensDenyList: refreshTokenJwtId } },
      { new: true }
    );
  } catch (error: any) {
    throw new Error(error, {
      cause: 'auth.service.ts -> updateSessionRefreshTokenDenyListService()',
    });
  }
}

async function deleteAuthSessionService(sessionId: Types.ObjectId | string): Promise<DeleteResult> {
  try {
    const deletedAuthSession: DeleteResult = await AuthModel.deleteOne({ _id: sessionId });

    return deletedAuthSession;
  } catch (error: any) {
    throw new Error(error, { cause: 'auth.service.ts -> deleteAuthSessionService()' });
  }
}

async function invalidateAllAuthSessionsService(userId: Types.ObjectId | string): Promise<void> {
  try {
    await AuthModel.deleteMany({ userId });
  } catch (error: any) {
    throw new Error(error, { cause: 'auth.service.ts -> invalidateAllAuthSessionsService()' });
  }
}

export {
  createNewAuthSessionService,
  deleteAuthSessionService,
  findSessionByIdService,
  invalidateAllAuthSessionsService,
  updateSessionRefreshTokenDenyListService,
};
