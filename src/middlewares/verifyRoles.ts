import type { RequestAfterJWTVerification } from "../resources/auth";
import type { Request, Response, NextFunction } from "express";

function verifyRoles() {
	// biome-ignore lint/complexity/useArrowFunction: <this is more explicit!>
	return function (
		request: RequestAfterJWTVerification,
		response: Response,
		next: NextFunction,
	) {
		const { url, method } = request;
		const { roles } = request.body.userInfo;

		console.log("\n");
		console.group("verifyRoles");
		console.log("url:", url);
		console.log("method:", method);
		console.log("roles:", roles);
		console.log("\n");
		console.groupEnd();

		// // default index route
		// if (url === "/") {
		// 	// the query params route
		// 	if (method === "GET") {
		// 		// only managers/admins are allowed to view resources of a type that does not belong to them
		// 		if (roles.includes("Manager") || roles.includes("Admin")) {
		// 			next();
		// 			return;
		// 		}

		// 		response
		// 			.status(403)
		// 			.json({ message: "User does not have permission", resourceData: [] });
		// 		return;
		// 	}

		// 	if (method === "POST" || method === "PUT" || method === "PATCH") {
		// 		// anyone can create a resource
		// 		next();
		// 		return;
		// 	}

		// 	if (method === "DELETE") {
		// 		// only managers are allowed to delete all resources of a type
		// 		if (roles.includes("Manager")) {
		// 			next();
		// 			return;
		// 		}

		// 		response
		// 			.status(403)
		// 			.json({ message: "User does not have permission", resourceData: [] });
		// 		return;
		// 	}
		// }
		// // user route (employee role viewing their own resources)
		// else if (url.includes("/user")) {
		// 	if (method === "GET") {
		// 		// anyone can view resources of a type that belong to them
		// 		next();
		// 		return;
		// 	}
		// }
		// // dev route
		// else if (url.includes("/dev")) {
		// 	// only admins/managers are allowed to
		// 	if (roles.includes("Manager") || roles.includes("Admin")) {
		// 		next();
		// 		return;
		// 	}
		// 	// customer payment info route
		// } else if (url.includes("/payment-info")) {
		// 	// only admins/managers are allowed to view payment info
		// 	if (roles.includes("Manager") || roles.includes("Admin")) {
		// 		next();
		// 		return;
		// 	}
		// 	// customer/user update password route
		// } else if (url.includes("/update-password")) {
		// 	// anyone can update their password
		// 	next();
		// 	return;
		// }

		// if (url.includes("/delete-all")) {
		// 	// only managers are allowed to delete all resources of a type
		// 	if (!roles.includes("Manager")) {
		// 		response
		// 			.status(403)
		// 			.json({ message: "User does not have permission", resourceData: [] });
		// 		return;
		// 	}
		// }

		// if (url.includes("/file-uploads")) {
		// 	// anyone can view/upload a file
		// 	next();
		// 	return;
		// }

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
	};
}

export { verifyRoles };
