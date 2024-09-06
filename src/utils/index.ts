import { RequestAfterJWTVerification } from "../resources/auth";
import { ErrorLogSchema } from "../resources/errorLog";
import { HttpResult } from "../types";

function createHttpResultError<Data = unknown>({
  data = [],
  kind = "error",
  message = "Unknown error",
  pages = 0,
  status = 500,
  totalDocuments = 0,
  triggerLogout = false,
}: {
  data?: Array<Data>;
  kind?: "error" | "success";
  message?: string;
  pages?: number;
  status?: number;
  totalDocuments?: number;
  triggerLogout?: boolean;
}): HttpResult<Data> {
  return {
    data,
    kind,
    message,
    pages,
    status,
    totalDocuments,
    triggerLogout,
  };
}

function createHttpResultSuccess<Data = unknown>({
  data = [],
  kind = "success",
  message = "Successful operation",
  pages = 0,
  status = 200,
  totalDocuments = 0,
  triggerLogout = false,
}: {
  data?: Array<Data>;
  kind?: "error" | "success";
  message?: string;
  pages?: number;
  status?: number;
  totalDocuments?: number;
  triggerLogout?: boolean;
}): HttpResult<Data> {
  return {
    data,
    kind,
    message,
    pages,
    status,
    totalDocuments,
    triggerLogout,
  };
}

function createErrorLogSchema(
  httpResult: HttpResult<unknown>,
  requestBody: RequestAfterJWTVerification["body"],
): ErrorLogSchema {
  const {
    userInfo: { userId, username },
    sessionId,
  } = requestBody;

  let stack = httpResult.data?.[0] instanceof Error
    ? httpResult.data?.[0].stack
    : "Unknown error";
  stack = stack ?? "Unknown error";

  return {
    expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
    message: httpResult.message,
    name: httpResult.data?.[0] instanceof Error
      ? httpResult.data?.[0].name
      : "Unknown error",
    stack,
    requestBody: JSON.stringify(requestBody),
    sessionId: sessionId.toString(),
    status: httpResult.status,
    timestamp: new Date(),
    userId: userId.toString(),
    username,
  };
}

function returnEmptyFieldsTuple(input: Record<string, unknown>) {
  const fieldValuesTuples: [string, boolean][] = Object.entries(input).map(
    ([field, value]) => [field, value === ""],
  );

  return fieldValuesTuples.filter(([_, value]) => value === true);
}

function removeUndefinedAndNullValues<T>(value?: T | null): value is T {
  return value !== undefined && value !== null;
}

type FilterFieldsFromObjectInput<
  Obj extends Record<string | number | symbol, unknown> = Record<
    string | symbol | number,
    unknown
  >,
> = {
  object: Obj;
  fieldsToFilter: Array<keyof Obj>;
};
/**
 * Pure function: Removes specified fields from an object and returns a new object with the remaining fields.
 */
function filterFieldsFromObject<
  Obj extends Record<string | number | symbol, unknown> = Record<
    string | symbol | number,
    unknown
  >,
  Keys extends keyof Obj = keyof Obj,
>({
  object,
  fieldsToFilter,
}: FilterFieldsFromObjectInput<Obj>): Omit<Obj, Keys> {
  return Object.entries(object).reduce((obj, [key, value]) => {
    if (fieldsToFilter.includes(key)) {
      return obj;
    }
    obj[key] = value;

    return obj;
  }, Object.create(null));
}

export {
  createErrorLogSchema,
  createHttpResultError,
  createHttpResultSuccess,
  filterFieldsFromObject,
  removeUndefinedAndNullValues,
  returnEmptyFieldsTuple,
};
