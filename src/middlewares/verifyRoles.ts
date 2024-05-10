import { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../resources/auth";
import type { Request, Response, NextFunction } from "express";

function verifyRoles(
  request: RequestAfterJWTVerification,
  response: Response,
  next: NextFunction
) {
  {
    const { url, method } = request;
    const { roles, userId } = request.body.userInfo;

    console.log("\n");
    console.group("verifyRoles");
    console.log("url:", url);
    console.log("method:", method);
    console.log("roles:", roles);
    console.log("\n");
    console.groupEnd();

    if (method === "POST") {
      // anyone can create a resource
      next();
      return;
    }

    if (method === "GET") {
      // all roles can access /user route: which can also be used to view resources that belong to them (employees route to view their own resources)
      if (url.includes("/user")) {
        next();
        return;
      }

      // else it is a manager/admin accessing a resource that does not belong to them (employee roles not allowed to view others' resources)
      if (roles.includes("Manager") || roles.includes("Admin")) {
        next();
        return;
      }

      response
        .status(403)
        .json({ message: "User does not have permission", resourceData: [] });
    }
    if (method === "PUT" || method === "PATCH") {
      // all roles can access /user route: which can also be used to modify resources that belong to them (employees route to modify their own resources)
      if (url.includes("/user")) {
        next();
        return;
      }

      // else it is a manager/admin accessing a resource that does not belong to them (employee roles not allowed to modify others' resources)
      if (roles.includes("Manager") || roles.includes("Admin")) {
        next();
        return;
      }

      response
        .status(403)
        .json({ message: "User does not have permission", resourceData: [] });
      return;
    }
    if (method === "DELETE") {
      // only managers are allowed to delete a resource
      if (roles.includes("Manager")) {
        next();
        return;
      }

      response
        .status(403)
        .json({ message: "User does not have permission", resourceData: [] });
      return;
    }

    // if none of the above conditions are met, request is not allowed
    response
      .status(403)
      .json({ message: "User does not have permission", resourceData: [] });
    return;
  }
}

export { verifyRoles };
