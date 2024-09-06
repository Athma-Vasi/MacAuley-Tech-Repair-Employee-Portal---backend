import { NextFunction, Request, Response } from "express";
import { ParsedQs } from "qs";

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

function createMongoDbQueryObject(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  const FIND_QUERY_OPTIONS_KEYWORDS = new Set([
    "tailable",
    "limit",
    "skip",
    "allowDiskUse",
    "batchSize",
    "readPreference",
    "hint",
    "comment",
    "lean",
    "populate",
    "maxTimeMS",
    "sort",
    "strict",
    "collation",
    "session",
    "explain",
  ]);

  const { query } = request;

  if (query === undefined) {
    Object.defineProperty(request, "query", {
      value: {
        projection: "",
        options: { sort: { createdAt: -1, _id: -1 }, limit: 10, skip: 0 },
        filter: {},
      },
    });
    next();
    return;
  }

  const EXCLUDED_SET = new Set([
    "page",
    "fields",
    "newQueryFlag",
    "totalDocuments",
  ]);
  const modifiedQuery = Object.entries(query).reduce((acc, tuple) => {
    const [key, value] = tuple as [
      string,
      string | ParsedQs | string[] | ParsedQs[] | undefined,
    ];

    if (value === undefined || EXCLUDED_SET.has(key)) {
      return acc;
    }

    Object.defineProperty(acc, key, { value });

    return acc;
  }, Object.create(null));

  const { newQueryFlag, totalDocuments, projection, ...rest } = modifiedQuery;

  const [options, filter] = Object.entries(rest).reduce(
    (acc, tuple) => {
      const [optionsAcc, filterAcc] = acc;
      const [key, value] = tuple as [
        string,
        string | ParsedQs | string[] | ParsedQs[] | undefined,
      ];

      if (value === undefined) {
        return acc;
      }

      if (FIND_QUERY_OPTIONS_KEYWORDS.has(key)) {
        Object.defineProperty(optionsAcc, key, { value });
      }

      // general text search of entire collection (with fields that have a 'text' index)
      // ex: { $text: { $search: 'searchTerm1 -searchTerm2', $caseSensitive: "true" } }
      if (key === "text") {
        Object.defineProperty(filterAcc, "$text", { value });
      }

      // convert string array into regex array for case insensitive search per field
      // ex: { field: { $in: [/searchTerm1/i, /searchTerm2/i] } }
      if (typeof value === "object" && value !== null) {
        const isInOperatorPresent = Object.hasOwn(value, "$in");

        if (isInOperatorPresent) {
          let inValue = Object.getOwnPropertyDescriptor(value, "$in")?.value;

          if (typeof inValue === "string") {
            inValue = new RegExp(inValue, "i");
          } else if (Array.isArray(inValue)) {
            inValue = inValue.flatMap((val) => new RegExp(val, "i"));
          }

          Object.defineProperty(filterAcc, key, { value: { $in: inValue } });
        } else {
          Object.defineProperty(filterAcc, key, { value });
        }
      }

      return acc;
    },
    [Object.create(null), Object.create(null)],
  );

  Object.hasOwn(options, "sort")
    ? Object.defineProperty(options, "sort", {
      value: { ...options.sort, _id: -1 },
    })
    : Object.defineProperty(options, "sort", {
      value: { createdAt: -1, _id: -1 },
    });

  // set pagination default values for limit and skip
  const page = Number(query.page) || 1;
  let limit = Number(query.limit) || 10;
  limit = limit < 1 ? 10 : limit > 25 ? 25 : limit;
  Object.defineProperty(options, "limit", { value: limit });

  let skip = query.skip ? Number(query.skip) : (page - 1) * limit; // offset
  skip = skip < 1 ? 0 : skip;
  Object.defineProperty(options, "skip", { value: skip });

  Object.defineProperty(request, "query", {
    value: { projection, options, filter },
  });
  Object.defineProperty(request, "body", {
    value: { ...request.body, newQueryFlag, totalDocuments },
  });
}

// function assignQueryDefaults(request: Request, _response: Response, next: NextFunction) {
//   const FIND_QUERY_OPTIONS_KEYWORDS = new Set([
//     "tailable",
//     "limit",
//     "skip",
//     "allowDiskUse",
//     "batchSize",
//     "readPreference",
//     "hint",
//     "comment",
//     "lean",
//     "populate",
//     "maxTimeMS",
//     "sort",
//     "strict",
//     "collation",
//     "session",
//     "explain",
//   ]);

//   /**
//    * Object.defineProperty is used to satisfy the typescript compiler
//    */

//   const PROPERTY_DESCRIPTOR: PropertyDescriptor = {
//     writable: true,
//     enumerable: true,
//     configurable: true,
//   };

//   const { query } = request;

//   // if query is undefined, set default values and return
//   if (!query) {
//     Object.defineProperty(request, "query", {
//       value: {
//         projection: "",
//         options: { sort: { createdAt: -1, _id: -1 }, limit: 10, skip: 0 },
//         filter: {},
//       },
//       ...PROPERTY_DESCRIPTOR,
//     });
//     next();
//     return;
//   }

//   const queryObject = structuredClone(query);
//   const excludedFields = ["page", "fields", "newQueryFlag", "totalDocuments"];
//   excludedFields.forEach((field) => delete queryObject[field]);

//   // convert 'in' values to array if only one value is provided
//   // mongoose does not accept a single value for 'in' operator
//   console.log("queryObject: ", queryObject);
//   Object.entries(queryObject).forEach(([queryKey, query]) => {
//     if (!query) {
//       return;
//     }

//     Object.entries(query).forEach(([operator, value]) => {
//       if (operator.endsWith("in")) {
//         // if its already in array form, do nothing
//         if (Array.isArray(value)) {
//           return;
//         }
//         Object.defineProperty(query, operator, {
//           value: [value],
//           ...PROPERTY_DESCRIPTOR,
//         });
//       }
//     });

//     Object.defineProperty(queryObject, queryKey, {
//       value: query,
//       ...PROPERTY_DESCRIPTOR,
//     });
//   });

//   // convert query object to string
//   let queryString = JSON.stringify(queryObject);
//   // replace operator with $operator
//   queryString = queryString.replace(
//     /\b(lte|lt|gte|gt|eq|in|ne|nin|search)\b/g,
//     (match) => `$${match}`
//   );
//   // convert string to object
//   const mongoDbQueryObject = JSON.parse(queryString);

//   const { projection, ...rest } = mongoDbQueryObject;
//   const options: Record<string, string | number | boolean> = {};
//   const filter: Record<string, string | number | boolean> = {};

//   console.log("mongoDbQueryObject: ", mongoDbQueryObject);
//   console.log("projection: ", projection);
//   console.log("rest: ", rest);
//   console.log("findQueryOptionsKeywords: ", FIND_QUERY_OPTIONS_KEYWORDS);

//   Object.entries(rest).forEach(([key, value]) => {
//     // if keys are in the findQueryOptionsKeywords set, then they will be part of the options object passed in the mongoose find method
//     if (FIND_QUERY_OPTIONS_KEYWORDS.has(key)) {
//       Object.defineProperty(options, key, {
//         value,
//         ...PROPERTY_DESCRIPTOR,
//       });
//     } // else they will be part of the filter object passed in same method
//     else {
//       // if key is text, then it is converted to $text for general text search of entire collection (with fields that have a 'text' index)
//       // from front-end's General Search inside QueryBuilder
//       // ex: { $text: { $search: 'searchTerm1 -searchTerm2', $caseSensitive: "true" } }
//       if (key === "text") {
//         Object.defineProperty(filter, "$text", {
//           value,
//           ...PROPERTY_DESCRIPTOR,
//         });
//       }
//       // else convert string array into regex array for case insensitive search per field
//       // from front-end's Search Chain inside QueryBuilder
//       // ex: { field: { $in: [/searchTerm1/i, /searchTerm2/i] } }
//       else {
//         // if value is an object, check if it has a $in property
//         const isInPropertyPresent = Object.hasOwn(value as Record<string, any>, "$in");

//         if (isInPropertyPresent) {
//           let inValue = Object.getOwnPropertyDescriptor(
//             value as Record<string, any>,
//             "$in"
//           )?.value;

//           // if value is string, convert to regex
//           if (typeof inValue === "string") {
//             inValue =
//               inValue === "true" || inValue === "false" // avoids Boolean CastError when querying boolean fields
//                 ? inValue
//                 : new RegExp(inValue, "i");
//           } else if (Array.isArray(inValue)) {
//             inValue = inValue.flatMap((val: string) => {
//               const splitRegexedVal = val
//                 .split(" ")
//                 .map((word) =>
//                   word === "true" || word === "false" ? word : new RegExp(word, "i")
//                 );

//               return splitRegexedVal;
//             });
//           }

//           Object.defineProperty(filter, key, {
//             value: { $in: inValue },
//             ...PROPERTY_DESCRIPTOR,
//           });
//         }
//         // ex: { field: { $eq: 'searchTerm' } }
//         else {
//           Object.defineProperty(filter, key, {
//             value,
//             ...PROPERTY_DESCRIPTOR,
//           });
//         }
//       }
//     }
//   });

//   // set default createdAt sort field if it does not exist: { createdAt: -1, _id: -1 }
//   // as all schemas have timestamps enabled, createdAt field is guaranteed to exist
//   if (!Object.hasOwn(options, "sort")) {
//     Object.defineProperty(options, "sort", {
//       value: { createdAt: -1 },
//       ...PROPERTY_DESCRIPTOR,
//     });
//   }
//   // if there is only one sort field, _id field with corresponding sort direction is added for consistent results
//   // as _id is unique, orderable and immutable
//   // ex: { createdAt: -1, _id: -1 }
//   const { sort } = options;
//   if (Object.keys(sort).length === 1) {
//     const sortDirection = Number(Object.values(sort)[0]) < 0 ? -1 : 1;
//     Object.defineProperty(sort, "_id", {
//       value: sortDirection,
//       ...PROPERTY_DESCRIPTOR,
//     });
//   }

//   // set pagination default values for limit and skip
//   const page = Number(query.page) || 1;
//   let limit = Number(query.limit) || 10;
//   limit = limit < 1 ? 10 : limit > 25 ? 25 : limit;
//   let skip = query.skip ? Number(query.skip) : (page - 1) * limit; // offset
//   skip = skip < 1 ? 0 : skip;
//   Object.defineProperty(options, "limit", {
//     value: limit,
//     ...PROPERTY_DESCRIPTOR,
//   });
//   Object.defineProperty(options, "skip", {
//     value: skip,
//     ...PROPERTY_DESCRIPTOR,
//   });

//   // overwrite query object with new values
//   Object.defineProperty(request, "query", {
//     value: { projection, options, filter },
//     ...PROPERTY_DESCRIPTOR,
//   });

//   // add newQueryFlag and totalDocuments to request body
//   Object.defineProperty(request, "body", {
//     value: {
//       ...request.body,
//       newQueryFlag: query.newQueryFlag,
//       totalDocuments: query.totalDocuments,
//     },
//     ...PROPERTY_DESCRIPTOR,
//   });

//   console.group("assignQueryDefaults");
//   console.log("REQUEST BODY", JSON.stringify(request.body, null, 2));
//   console.log("query.newQueryFlag: ", query.newQueryFlag);
//   console.log("query.totalDocuments: ", query.totalDocuments);
//   console.log({ options, projection, filter });
//   console.log("stringified filter: ", JSON.stringify(filter));
//   console.groupEnd();

//   next();
//   return;

// }

export { createMongoDbQueryObject };
