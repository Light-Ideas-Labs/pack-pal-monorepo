"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pinoLogger = exports.winstonLogger = exports.logEvents = exports.requestLogger = exports.logger = void 0;
const date_fns_1 = require("date-fns");
const uuid_1 = require("uuid");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const pino_1 = __importDefault(require("pino"));
// Determine log level
const logLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';
const logOption = process.env.LOGGER || 'winston';
// Winston configuration
const alignColorsAndTime = winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.label({ label: '[LOGGER]' }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.printf((info) => {
    return ` ${info.label} - [${info.timestamp}] [${info.level}]: ${info.message} ${info.stack || ''}`;
}));
const winstonLogger = winston_1.default.createLogger({
    level: logLevel,
    transports: [
        new winston_1.default.transports.Console({ format: alignColorsAndTime }),
        new winston_daily_rotate_file_1.default({
            filename: path_1.default.join(process.cwd(), 'logs', 'application-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d',
        }),
    ],
});
exports.winstonLogger = winstonLogger;
// Pino configuration
const pinoLogger = (0, pino_1.default)({
    level: logLevel,
    transport: logOption === 'pino'
        ? {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
            },
        }
        : undefined,
});
exports.pinoLogger = pinoLogger;
// Unified logger interface
exports.logger = {
    info: (...args) => logOption === 'pino' ? pinoLogger.info(...args) : winstonLogger.info(...args),
    error: (...args) => logOption === 'pino' ? pinoLogger.error(...args) : winstonLogger.error(...args),
    debug: (...args) => logOption === 'pino'
        ? (pinoLogger.debug ? pinoLogger.debug(...args) : pinoLogger.info(...args))
        : winstonLogger.debug(...args),
};
// Logger middleware for Express
const requestLogger = (req, res, next) => {
    res.on('finish', () => {
        const logData = {
            message: `${req.method}\t${req.url}\t${res.statusCode}\t${req.headers.origin || 'N/A'}`,
            request: {
                method: req.method,
                url: req.url,
                headers: req.headers,
                body: req.body,
            },
            responseStatus: res.statusCode,
        };
        exports.logger.debug(JSON.stringify(logData, null, 2));
    });
    console.log(`${req.method} ${req.path}`);
    next();
};
exports.requestLogger = requestLogger;
// Optional file logger (used for raw logs)
const logEvents = async (message, logFileName) => {
    if (process.env.LOGGER !== 'file')
        return;
    const dateTime = (0, date_fns_1.format)(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const logItem = `${dateTime}\t${(0, uuid_1.v4)()}\t${message}\n`;
    try {
        const logsDir = path_1.default.join(process.cwd(), 'logs');
        await promises_1.default.mkdir(logsDir, { recursive: true });
        await promises_1.default.appendFile(path_1.default.join(logsDir, logFileName), logItem);
    }
    catch (error) {
        exports.logger.error('Error in logEvents:', error);
    }
};
exports.logEvents = logEvents;
