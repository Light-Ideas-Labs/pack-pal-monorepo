"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleErrorsMiddleware = exports.uniqueErrorHandler = exports.flashValidationErrors = exports.CatchAsyncError = exports.baseResponse = exports.removeFavicon = exports.syntaxError = exports.errorHandler = exports.NotFoundError = exports.unauthorized = exports.unauthenticated = exports.ErrorHandler = exports.ApiError = exports.GeneralError = void 0;
const http_status_codes_1 = require("http-status-codes");
const winston_config_js_1 = __importDefault(require("../config/winston.config.js"));
class GeneralError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
    getCode() {
        return 400;
    }
}
exports.GeneralError = GeneralError;
class ApiError extends Error {
    constructor(statusCode, message, stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.ApiError = ApiError;
class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.ErrorHandler = ErrorHandler;
const unauthenticated = (req, res) => {
    const msg = `Unauthenticated.`;
    res.status(401).json({
        error: new Error(msg).toString(),
        message: msg,
    });
};
exports.unauthenticated = unauthenticated;
const unauthorized = (req, res) => {
    const msg = `Unauthorized.`;
    res.status(403).json({
        error: new Error(msg).toString(),
        message: msg,
    });
};
exports.unauthorized = unauthorized;
const NotFoundError = (req, res) => {
    const msg = `Route : ${req.url} Not found.`;
    winston_config_js_1.default.warn(`[404] Not found: ${req.url}`);
    res.status(404).json({
        error: new Error(msg).toString(),
        message: msg,
    });
};
exports.NotFoundError = NotFoundError;
const errorHandler = (error, req, res, next) => {
    var _a;
    winston_config_js_1.default.error(`[${req.method}] ${req.url} - ${error.message}`, {
        stack: error.stack,
        statusCode: error.statusCode,
        user: (_a = req.user) === null || _a === void 0 ? void 0 : _a.email,
        params: req.params,
        body: req.body,
        query: req.query,
    });
    res.status(error.statusCode || 500).json({
        message: error.message || "Internal Server Error",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
};
exports.errorHandler = errorHandler;
const syntaxError = (error, req, res, next) => {
    winston_config_js_1.default.error(`[SYNTAX ERROR] ${req.url} - ${error.message}`, { stack: error.stack });
    const result = {
        status: `syntax error ${error.type}`,
        message: error.toString(),
        data: error.toString(),
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    };
    if (error instanceof SyntaxError) {
        res.status(400).send(result);
    }
    else {
        next();
    }
};
exports.syntaxError = syntaxError;
const removeFavicon = (req, res, next) => {
    if (req.url === "/favicon.ico") {
        res.writeHead(200, { "Content-Type": "image/x-icon" });
        res.end();
    }
    else {
        next();
    }
};
exports.removeFavicon = removeFavicon;
const baseResponse = (res, statusCode, message, data) => {
    let code;
    switch (statusCode) {
        case "success":
            code = http_status_codes_1.StatusCodes.OK;
            break;
        case "created":
            code = http_status_codes_1.StatusCodes.CREATED;
            break;
        case "bad":
            code = http_status_codes_1.StatusCodes.BAD_REQUEST;
            break;
        case "unauthorized":
            code = http_status_codes_1.StatusCodes.UNAUTHORIZED;
            break;
        case "forbidden":
            code = http_status_codes_1.StatusCodes.FORBIDDEN;
            break;
        case "notFound":
            code = http_status_codes_1.StatusCodes.NOT_FOUND;
            break;
        case "conflict":
            code = http_status_codes_1.StatusCodes.CONFLICT;
            break;
        case "unprocessable":
            code = http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY;
            break;
        case "internal":
            code = http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
            break;
        default:
            code = http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
            break;
    }
    return res.status(code).json({ status: statusCode, message, data });
};
exports.baseResponse = baseResponse;
const CatchAsyncError = (passedFunction) => (req, res, next) => {
    Promise.resolve(passedFunction(req, res, next)).catch(next);
};
exports.CatchAsyncError = CatchAsyncError;
const flashValidationErrors = (err, req, res, next) => {
    if (!err.errors)
        return next(err);
    const errorKeys = Object.keys(err.errors);
    errorKeys.forEach((key) => req.flash("error", err.errors[key].message));
    res.redirect("back");
};
exports.flashValidationErrors = flashValidationErrors;
const handleErrorsMiddleware = (err, req, res, next) => {
    const customError = {
        statusCode: err.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || "Something went wrong, please try again later!",
    };
    if (err.name === "ValidationError") {
        customError.msg = Object.values(err.errors).map((value) => value.message).join(", ");
        customError.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
    }
    if (err.code && err.code === 11000) {
        customError.msg = `Duplicate ${Object.keys(err.keyValue)} entered, please choose another value`;
        customError.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
    }
    if (err.name === "CastError") {
        customError.msg = `Invalid ${err.path}: ${err.value}`;
        customError.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
    }
    return res.status(customError.statusCode).json({ msg: customError.msg });
};
exports.handleErrorsMiddleware = handleErrorsMiddleware;
const uniqueErrorHandler = (error) => {
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
    }
    else {
        for (let errorName in error.errors) {
            if (error.errors[errorName].message) {
                message = error.errors[errorName].message;
            }
        }
    }
    return message;
};
exports.uniqueErrorHandler = uniqueErrorHandler;
