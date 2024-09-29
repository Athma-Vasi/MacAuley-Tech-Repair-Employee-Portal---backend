import { allowedOrigins } from "./allowedOrigins";

type CustomOrigin = (
  requestOrigin: string | undefined,
  callback: (err: Error | null, origin?: StaticOrigin) => void,
) => void;
type StaticOrigin = string | boolean | RegExp | (string | boolean | RegExp)[];

type CorsOptions = {
  /**
   * @default '*''
   */
  origin?: StaticOrigin | CustomOrigin | undefined;
  /**
   * @default 'GET,HEAD,PUT,PATCH,POST,DELETE'
   */
  methods?: string | string[] | undefined;
  allowedHeaders?: string | string[] | undefined;
  exposedHeaders?: string | string[] | undefined;
  credentials?: boolean | undefined;
  maxAge?: number | undefined;
  /**
   * @default false
   */
  preflightContinue?: boolean | undefined;
  /**
   * @default 204
   */
  optionsSuccessStatus?: number | undefined;
};

const corsOptions: CorsOptions = {
  origin: (
    requestOrigin: string | undefined,
    callback: (err: Error | null, origin?: StaticOrigin) => void,
  ): void => {
    // TODO: remove the undefined
    if (allowedOrigins.indexOf(requestOrigin ?? "undefined") !== -1) {
      callback(null, true);
    } else {
      const message =
        `The CORS policy for this site does not allow access from the specified Origin: ${requestOrigin}`;
      callback(new Error(message), false);
    }
  },
  credentials: true, // required for cookies to be sent with the request
  optionsSuccessStatus: 200,
};

export { corsOptions };
