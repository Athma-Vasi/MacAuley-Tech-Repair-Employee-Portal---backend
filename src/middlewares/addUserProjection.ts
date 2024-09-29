import { NextFunction, Request, Response } from "express";

function addUserProjection(
    request: Request,
    _response: Response,
    next: NextFunction,
) {
    const projection = ["-password", "-paymentInformation"];
    Object.defineProperty(request.query, "projection", {
        value: projection,
        writable: true,
        enumerable: true,
        configurable: true,
    });

    return next();
}

export { addUserProjection };
