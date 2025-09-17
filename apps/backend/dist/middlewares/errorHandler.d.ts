import { Request, Response, NextFunction, RequestHandler } from "express";
declare global {
    namespace Express {
        interface Request {
            flash(type: string, message: string): void;
        }
    }
}
declare class GeneralError extends Error {
    constructor(message: string);
    getCode(): number;
}
declare class ApiError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;
    constructor(statusCode: number, message: string, stack?: string);
}
declare class ErrorHandler extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number);
}
declare const unauthenticated: RequestHandler;
declare const unauthorized: RequestHandler;
declare const NotFoundError: RequestHandler;
declare const errorHandler: (error: any, req: Request, res: Response, next: NextFunction) => void;
declare const syntaxError: (error: any, req: Request, res: Response, next: NextFunction) => void;
declare const removeFavicon: RequestHandler;
declare const baseResponse: (res: Response, statusCode: string, message: string, data: any) => Response;
declare const CatchAsyncError: (passedFunction: RequestHandler) => RequestHandler;
declare const flashValidationErrors: (err: any, req: Request, res: Response, next: NextFunction) => void;
declare const handleErrorsMiddleware: (err: any, req: Request, res: Response, next: NextFunction) => Response;
declare const uniqueErrorHandler: (error: any) => string;
export { GeneralError, ApiError, ErrorHandler, unauthenticated, unauthorized, NotFoundError, errorHandler, syntaxError, removeFavicon, baseResponse, CatchAsyncError, flashValidationErrors, uniqueErrorHandler, handleErrorsMiddleware, };
