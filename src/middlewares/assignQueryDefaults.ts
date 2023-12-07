import { NextFunction, Request, Response } from "express";

/**
 * - This middleware uses closure to pass in the keywords that are used to determine if a query parameter is a find query option and sets default values for sorting and projection options when querying a MongoDB database
 * - Queries must be of the form:
 * /resource?filter1[operator]=value1&filter2[operator]=value2&projection=-field1ToExclude&projection=-field2ToExclude&sort[sortField1]=number&skip=number&limit=number  and so on
 */
const assignQueryDefaults =
  (findQueryOptionsKeywords: Set<string>) =>
  (request: Request, _response: Response, next: NextFunction) => {
    /**
     * Object.defineProperty is used to satisfy the typescript compiler
     */

    const propertyDescriptor: PropertyDescriptor = {
      writable: true,
      enumerable: true,
      configurable: true,
    };

    const { query } = request;

    // if query is undefined, set default values and return
    if (!query) {
      Object.defineProperty(request, "query", {
        value: {
          projection: "-__v",
          options: { sort: { createdAt: -1, _id: -1 }, limit: 10, skip: 0 },
          filter: {},
        },
        ...propertyDescriptor,
      });
      next();
      return;
    }

    const queryObject = structuredClone(query);
    const excludedFields = ["page", "fields", "newQueryFlag", "totalDocuments"];
    excludedFields.forEach((field) => delete queryObject[field]);

    // convert 'in' values to array if only one value is provided
    // mongoose does not accept a single value for 'in' operator
    console.log("queryObject: ", queryObject);
    Object.entries(queryObject).forEach(([queryKey, query]) => {
      if (!query) {
        return;
      }

      Object.entries(query).forEach(([operator, value]) => {
        if (operator.endsWith("in")) {
          // if its already in array form, return
          if (Array.isArray(value)) {
            return;
          }
          Object.defineProperty(query, operator, {
            value: [value],
            ...propertyDescriptor,
          });
        }
      });

      Object.defineProperty(queryObject, queryKey, {
        value: query,
        ...propertyDescriptor,
      });
    });

    // convert query object to string
    let queryString = JSON.stringify(queryObject);
    // replace operator with $operator
    queryString = queryString.replace(
      /\b(lte|lt|gte|gt|eq|in|ne|nin|search)\b/g,
      (match) => `$${match}`
    );
    // convert string to object
    const mongoDbQueryObject = JSON.parse(queryString);

    let { projection, ...rest } = mongoDbQueryObject;
    const options: Record<string, string | number | boolean> = {};
    const filter: Record<string, string | number | boolean> = {};

    console.log("mongoDbQueryObject: ", mongoDbQueryObject);
    console.log("projection: ", projection);
    console.log("rest: ", rest);
    console.log("findQueryOptionsKeywords: ", findQueryOptionsKeywords);

    Object.entries(rest).forEach(([key, value]) => {
      // if keys are in the findQueryOptionsKeywords set, then they will be part of the options object passed in the mongoose find method
      if (findQueryOptionsKeywords.has(key)) {
        Object.defineProperty(options, key, {
          value,
          ...propertyDescriptor,
        });
      } // else they will be part of the filter object passed in same method
      else {
        // if key is text, then it is converted to $text for general text search of entire collection (with fields that have a 'text' index)
        // from front-end's General Search inside QueryBuilder
        // ex: { $text: { $search: 'searchTerm1 -searchTerm2', $caseSensitive: "true" } }
        if (key === "text") {
          Object.defineProperty(filter, "$text", {
            value,
            ...propertyDescriptor,
          });
        }
        // else convert string array into regex array for case insensitive search per field
        // from front-end's Search Chain inside QueryBuilder
        // ex: { field: { $in: [/searchTerm1/i, /searchTerm2/i] } }
        else {
          // if value is an object, check if it has a $in property
          const isInPropertyPresent = Object.hasOwn(value as Record<string, any>, "$in");

          if (isInPropertyPresent) {
            let inValue = Object.getOwnPropertyDescriptor(
              value as Record<string, any>,
              "$in"
            )?.value;

            // if value is string, convert to regex
            if (typeof inValue === "string") {
              inValue = new RegExp(inValue, "i");
            } else if (Array.isArray(inValue)) {
              inValue = inValue.flatMap((val: string) => {
                const splitRegexedVal = val
                  .split(" ")
                  .map((word) => new RegExp(word, "i"));

                return splitRegexedVal;
              });
            }

            console.log("inValue: ", inValue);

            Object.defineProperty(filter, key, {
              value: { $in: inValue },
              ...propertyDescriptor,
            });
          }
          // ex: { field: { $eq: 'searchTerm' } }
          else {
            Object.defineProperty(filter, key, {
              value,
              ...propertyDescriptor,
            });
          }
        }
      }
    });

    // set default createdAt sort field if it does not exist: { createdAt: -1, _id: -1 }
    // as all schemas have timestamps enabled, createdAt field is guaranteed to exist
    if (!Object.hasOwn(options, "sort")) {
      Object.defineProperty(options, "sort", {
        value: { createdAt: -1 },
        ...propertyDescriptor,
      });
    }
    // if there is only one sort field, _id field with corresponding sort direction is added for consistent results
    // as _id is unique, orderable and immutable
    // ex: { createdAt: -1, _id: -1 }
    const { sort } = options;
    if (Object.keys(sort).length === 1) {
      const sortDirection = Number(Object.values(sort)[0]) < 0 ? -1 : 1;
      Object.defineProperty(sort, "_id", {
        value: sortDirection,
        ...propertyDescriptor,
      });
    }

    // set default projection exclusion if it does not exist
    if (!Object.hasOwn(mongoDbQueryObject, "projection")) {
      projection = "-__v";
    } else {
      // check if projection is exclusive or inclusive and add -__v to projection exclusion if it does not exist
      if (typeof projection === "string") {
        // ex: '-field1 -field2'
        if (projection.startsWith("-")) {
          if (!projection.includes("-__v")) {
            projection = projection.concat(" -__v");
          }
        }
      } else if (Array.isArray(projection)) {
        // ex: ['-field1', '-field2']
        if (projection[0].startsWith("-")) {
          if (!projection[0].includes("-__v")) {
            projection.push("-__v");
          }
        }
      } else if (typeof projection === "object") {
        // ex: { field1: 1, field2: 1 }
        const calculateProjectionScore = (projection: Record<string, number>): number => {
          return Object.values(projection).reduce((acc, curr) => {
            return acc + curr;
          }, 0);
        };
        // projection score of 0 means it is exclusive
        if (calculateProjectionScore(projection) === 0) {
          // ex: { field1: 0, field2: 0 }
          if (!Object.hasOwn(projection, "__v")) {
            Object.defineProperty(projection, "__v", {
              value: 0,
              ...propertyDescriptor,
            });
          }
        }
      }
    }

    // set pagination default values for limit and skip
    const page = Number(query.page) || 1;
    let limit = Number(query.limit) || 10;
    limit = limit < 1 ? 10 : limit > 25 ? 25 : limit;
    let skip = query.skip ? Number(query.skip) : (page - 1) * limit; // offset
    skip = skip < 1 ? 0 : skip;
    Object.defineProperty(options, "limit", {
      value: limit,
      ...propertyDescriptor,
    });
    Object.defineProperty(options, "skip", {
      value: skip,
      ...propertyDescriptor,
    });

    // overwrite query object with new values
    Object.defineProperty(request, "query", {
      value: { projection, options, filter },
      ...propertyDescriptor,
    });

    // add newQueryFlag and totalDocuments to request body
    Object.defineProperty(request, "body", {
      value: {
        ...request.body,
        newQueryFlag: query.newQueryFlag,
        totalDocuments: query.totalDocuments,
      },
      ...propertyDescriptor,
    });

    console.group("assignQueryDefaults");
    console.log("REQUEST BODY", JSON.stringify(request.body, null, 2));
    console.log("query.newQueryFlag: ", query.newQueryFlag);
    console.log("query.totalDocuments: ", query.totalDocuments);
    console.log({ options, projection, filter });
    console.log("stringified filter: ", JSON.stringify(filter));
    console.groupEnd();

    next();
    // return;

    /**
     * example: here is a sample query object before transformation:
     * queryObject:  {
          createdAt: { eq: '2023-11-11' },
          reasonForLeave: { in: 'Vacation' },
          requestStatus: { in: 'pending' },
          acknowledgement: { in: 'true' },
          projection: [ '-action', '-category' ]
       }

        and here is the transformed query object:
        {
          options: { sort: { createdAt: -1, _id: -1 }, limit: 10, skip: 0 },
          projection: [ '-action', '-category', '-__v' ],
            filter: {
              createdAt: { '$eq': '2023-11-11' },
              reasonForLeave: { '$in': ['Vacation'] },
              requestStatus: { '$in': ['pending'] },
              acknowledgement: { '$in': ['true'] }
            }
        }


        
     */
  };

export { assignQueryDefaults };
