import { NextFunction, Request, Response } from 'express';

/**
 * - This middleware uses closure to pass in the keywords that are used to determine if a query parameter is a find query option and sets default values for sorting and projection options when querying a MongoDB database using query parameters in an Express application
 * - Queries must be of the form:
 * /resource?filter1[operator]=value1&filter2[operator]=value2&projection=-field1ToExclude&projection=-field2ToExclude&sort[sortField1]=number&skip=number&limit=number  and so on
 */
const assignQueryDefaults =
  (findQueryOptionsKeywords: Set<string>) =>
  (request: Request, response: Response, next: NextFunction) => {
    const { query } = request;

    const queryObject = { ...query };
    // convert query object to string
    let queryString = JSON.stringify(queryObject);
    // replace gte, gt, lte, lt, eq, in, ne, nin with $gte, $gt, $lte, $lt, $eq, $in, $ne, $nin
    queryString = queryString.replace(/\b(lte|lt|gte|gt|eq|in|ne|nin)\b/g, (match) => `$${match}`);
    // convert string to object
    const mongoDbQueryObject = JSON.parse(queryString);

    let { projection, ...rest } = mongoDbQueryObject;

    const options = {};
    const filter = {};
    // if keys are in the keywords array, then they are part of the options object passed in the mongoose find method else they are part of the filter object passed in the mongoose find method
    for (const key in rest) {
      findQueryOptionsKeywords.has(key)
        ? Object.defineProperty(options, key, {
            value: rest[key],
            writable: true,
            enumerable: true,
            configurable: true,
          })
        : Object.defineProperty(filter, key, {
            value: rest[key],
            writable: true,
            enumerable: true,
            configurable: true,
          });
    }

    // set default sort field if it does not exist
    if (!Object.hasOwn(options, 'sort')) {
      Object.defineProperty(options, 'sort', {
        value: { createdAt: -1 },
        writable: true,
        enumerable: true,
        configurable: true,
      });
    }

    // set default projection exclusion if it does not exist
    if (!Object.hasOwn(mongoDbQueryObject, 'projection')) {
      projection = '-__v';
    } else {
      // add -__v to projection exclusion if it does not exist
      if (typeof projection === 'string') {
        // check if projection is exclusive or inclusive
        if (projection.startsWith('-')) {
          // only add -__v if it does not exist
          if (!projection.includes('-__v')) {
            projection = projection.concat(' -__v');
          }
        }
      } else if (Array.isArray(projection)) {
        // check if projection is exclusive or inclusive
        if (projection[0].startsWith('-')) {
          // only add -__v if it does not exist
          if (!projection[0].includes('-__v')) {
            projection.push('-__v');
          }
        }
      } else if (typeof projection === 'object') {
        // check if projection is exclusive or inclusive
        const calculateProjectionScore = (projection: Record<string, number>): number => {
          // rome-ignore lint: <basic reduce 【・_・?】>
          return Object.values(projection).reduce((acc, curr) => (acc += curr), 0);
        };

        // projection score of 0 means it is exclusive
        if (calculateProjectionScore(projection) === 0) {
          // only add -__v if it does not exist
          if (!Object.hasOwn(projection, '__v')) {
            Object.defineProperty(projection, '__v', {
              value: 0,
              writable: true,
              enumerable: true,
              configurable: true,
            });
          }
        }
      }
    }

    // overwrite query object with new values
    Object.defineProperty(request, 'query', {
      value: { projection, options, filter },
      writable: true,
      enumerable: true,
      configurable: true,
    });

    console.group('assignQueryDefaults');
    console.log({ options, filter });
    console.groupEnd();

    next();
  };

export { assignQueryDefaults };
