import type { RequestAfterJWTVerification } from '../resources/auth';
import type { Request, Response, NextFunction } from 'express';

function verifyRoles() {
  return function (request: RequestAfterJWTVerification, response: Response, next: NextFunction) {
    const { url, method } = request;
    const { roles } = request.body.userInfo;

    console.log('\n');
    console.group('verifyRoles');
    console.log('url:', url);
    console.log('method:', method);
    console.log('roles:', roles);
    console.log('\n');
    console.groupEnd();

    // default index route
    if (url === '/') {
      // the query params route
      if (method === 'GET') {
        // only managers/admins are allowed to view resources of a type that does not belong to them
        if (roles.includes('Manager') || roles.includes('Admin')) {
          next();
          return;
        }

        response.status(403).json({ message: 'User does not have permission', resourceData: [] });
        return;
      }

      if (method === 'POST') {
        // anyone can create a resource
        next();
        return;
      }

      if (method === 'DELETE') {
        // only managers are allowed to delete all resources of a type
        if (roles.includes('Manager')) {
          next();
          return;
        }

        response.status(403).json({ message: 'User does not have permission', resourceData: [] });
        return;
      }
    }
    // user route
    else if (url.includes('/user')) {
      if (method === 'GET') {
        // anyone can view resources of a type that belong to them
        next();
        return;
      }
    }
    // the dynamic param id route
    else {
      if (method === 'GET') {
        // only managers/admins are allowed to view a resource that does not belong to them by its id
        if (roles.includes('Manager') || roles.includes('Admin')) {
          next();
          return;
        }

        response.status(403).json({ message: 'User does not have permission', resourceData: [] });
        return;
      }

      if (method === 'DELETE') {
        // only managers are allowed to delete a resource that does not belong to them by its id
        if (roles.includes('Manager')) {
          next();
          return;
        }

        response.status(403).json({ message: 'User does not have permission', resourceData: [] });
        return;
      }
    }

    // if none of the above conditions are met, request is not allowed
    response.status(403).json({ message: 'User does not have permission', resourceData: [] });
    return;
  };
}

export { verifyRoles };

/**
 *  switch (url) {
      // default index route
      case '/': {
        // the query params route
        if (method === 'GET') {
          // only managers/admins are allowed to view resources of a type that does not belong to them
          if (roles.includes('Manager') || roles.includes('Admin')) {
            next();
            return;
          }

          response.status(403).json({ message: 'User does not have permission', resourceData: [] });
          return;
        }

        if (method === 'POST') {
          // anyone can create a resource
          next();
          return;
        }

        if (method === 'DELETE') {
          // only managers are allowed to delete all resources of a type
          if (roles.includes('Manager')) {
            next();
            return;
          }

          response.status(403).json({ message: 'User does not have permission', resourceData: [] });
          return;
        }
      }

      // user route
      case '/user': {
        if (method === 'GET') {
          // anyone can view resources of a type that belong to them
          next();
          return;
        }
      }

      // the dynamic param id route
      default: {
        if (method === 'GET') {
          // only managers/admins are allowed to view a resource that does not belong to them by its id
          if (roles.includes('Manager') || roles.includes('Admin')) {
            next();
            return;
          }

          response.status(403).json({ message: 'User does not have permission', resourceData: [] });
          return;
        }

        if (method === 'DELETE') {
          // only managers are allowed to delete a resource that does not belong to them by its id
          if (roles.includes('Manager')) {
            next();
            return;
          }

          response.status(403).json({ message: 'User does not have permission', resourceData: [] });
          return;
        }
      }
    }
 */
