import { ReasonPhrases, StatusCodes,} from "http-status-codes";
import { Request, Response, NextFunction, RequestHandler } from "express";
import logger from "../config/winston.config";

class GeneralError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }

  getCode(): number {
    return 400;
  }
}

class ApiError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(statusCode: number, message: string, stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

class ErrorHandler extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

const unauthenticated: RequestHandler = (req, res) => {
  const msg = `Unauthenticated.`;
  res.status(401).json({
    error: new Error(msg).toString(),
    message: msg,
  });
};

const unauthorized: RequestHandler = (req, res) => {
  const msg = `Unauthorized.`;
  res.status(403).json({
    error: new Error(msg).toString(),
    message: msg,
  });
};

const NotFoundError: RequestHandler = (req, res) => {
  const msg = `Route : ${req.url} Not found.`;
  logger.warn(`[404] Not found: ${req.url}`);
  res.status(404).json({
    error: new Error(msg).toString(),
    message: msg,
  });
};

const errorHandler = (error: any, req: Request, res: Response, next: NextFunction): void => {
  logger.error(`[${req.method}] ${req.url} - ${error.message}`, {
    stack: error.stack,
    statusCode: error.statusCode,
    user: req.user?.email,
    params: req.params,
    body: req.body,
    query: req.query,
  });

  res.status(error.statusCode || 500).json({
    message: error.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });
};

const syntaxError = (error: any, req: Request, res: Response, next: NextFunction): void => {
  logger.error(`[SYNTAX ERROR] ${req.url} - ${error.message}`, { stack: error.stack });

  const result: any = {
    status: `syntax error ${error.type}`,
    message: error.toString(),
    data: error.toString(),
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  };

  if (error instanceof SyntaxError) {
    res.status(400).send(result);
  } else {
    next();
  }
};

const removeFavicon: RequestHandler = (req, res, next) => {
  if (req.url === "/favicon.ico") {
    res.writeHead(200, { "Content-Type": "image/x-icon" });
    res.end();
  } else {
    next();
  }
};

const baseResponse = (res: Response, statusCode: string, message: string, data: any): Response => {
  let code: number;
  switch (statusCode) {
    case "success": code = StatusCodes.OK; break;
    case "created": code = StatusCodes.CREATED; break;
    case "bad": code = StatusCodes.BAD_REQUEST; break;
    case "unauthorized": code = StatusCodes.UNAUTHORIZED; break;
    case "forbidden": code = StatusCodes.FORBIDDEN; break;
    case "notFound": code = StatusCodes.NOT_FOUND; break;
    case "conflict": code = StatusCodes.CONFLICT; break;
    case "unprocessable": code = StatusCodes.UNPROCESSABLE_ENTITY; break;
    case "internal": code = StatusCodes.INTERNAL_SERVER_ERROR; break;
    default: code = StatusCodes.INTERNAL_SERVER_ERROR; break;
  }
  return res.status(code).json({ status: statusCode, message, data });
};

const CatchAsyncError = (passedFunction: RequestHandler): RequestHandler => (req, res, next) => {
  Promise.resolve(passedFunction(req, res, next)).catch(next);
};

const flashValidationErrors = (err: any, req: Request, res: Response, next: NextFunction): void => {
  if (!err.errors) return next(err);
  const errorKeys = Object.keys(err.errors);
  errorKeys.forEach((key) => req.flash("error", err.errors[key].message));
  res.redirect("back");
};

const handleErrorsMiddleware = (err: any, req: Request, res: Response, next: NextFunction): Response => {
  const customError = {
    statusCode: err.status || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, please try again later!",
  };

  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors).map((value: any) => value.message).join(", ");
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate ${Object.keys(err.keyValue)} entered, please choose another value`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.name === "CastError") {
    customError.msg = `Invalid ${err.path}: ${err.value}`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
};

const uniqueErrorHandler = (error: any): string => {
  let message = "";

  if (error.code) {
    switch (error.code) {
      case 11000:
      case 11001:
        const field = Object.keys(error.keyValue)[0];
        const value = error.keyValue[field];
        message = `The value '${value}' is already in use for '${field}'. Please choose another ${field}.`;
        break;
      default:
        message = "An unexpected error occurred.";
    }
  } else {
    for (let errorName in error.errors) {
      if (error.errors[errorName].message) {
        message = error.errors[errorName].message;
      }
    }
  }

  return message;
};

export {
  GeneralError,
  ApiError,
  ErrorHandler,
  unauthenticated,
  unauthorized,
  NotFoundError,
  errorHandler,
  syntaxError,
  removeFavicon,
  baseResponse,
  CatchAsyncError,
  flashValidationErrors,
  uniqueErrorHandler,
  handleErrorsMiddleware,
};
