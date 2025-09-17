import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import fsPromises from 'fs/promises';
import path from 'path';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import pino from 'pino';
import type { Request, Response, NextFunction } from 'express';
type LogArgs = [message: string, ...optionalParams: any[]];

// middlewares/logger.ts

export type AppLogger = {
  info: (...args: any[]) => void;
  error: (...args: any[]) => void;
  debug: (...args: any[]) => void;
};


// Determine log level
const logLevel: string = process.env.NODE_ENV === 'production' ? 'info' : 'debug';
const logOption: string = process.env.LOGGER || 'winston';

// Winston configuration
const alignColorsAndTime = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.label({ label: '[LOGGER]' }),
  winston.format.errors({ stack: true }),
  winston.format.printf((info) => {
    return ` ${info.label} - [${info.timestamp}] [${info.level}]: ${info.message} ${info.stack || ''}`;
  })
);

const winstonLogger = winston.createLogger({
  level: logLevel,
  transports: [
    new winston.transports.Console({ format: alignColorsAndTime }),
    new DailyRotateFile({
      filename: path.join(process.cwd(), 'logs', 'application-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
});

// Pino configuration
const pinoLogger = pino({
  level: logLevel,
  transport:
    logOption === 'pino'
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

// Unified logger interface
export const logger = {
  info: (...args: LogArgs) =>
    logOption === 'pino' ? pinoLogger.info(...args) : winstonLogger.info(...args),
  error: (...args: LogArgs) =>
    logOption === 'pino' ? pinoLogger.error(...args) : winstonLogger.error(...args),
  debug: (...args: LogArgs) =>
    logOption === 'pino'
      ? (pinoLogger.debug ? pinoLogger.debug(...args) : pinoLogger.info(...args))
      : winstonLogger.debug(...args),
};

// Logger middleware for Express
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
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
    
    logger.debug(JSON.stringify(logData, null, 2));
  });

  console.log(`${req.method} ${req.path}`);
  next();
};

// Optional file logger (used for raw logs)
export const logEvents = async (message: string, logFileName: string): Promise<void> => {
  if (process.env.LOGGER !== 'file') return;

  const dateTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  const logItem = `${dateTime}\t${uuidv4()}\t${message}\n`;

  try {
    const logsDir = path.join(process.cwd(), 'logs');
    await fsPromises.mkdir(logsDir, { recursive: true });
    await fsPromises.appendFile(path.join(logsDir, logFileName), logItem);
  } catch (error) {
    logger.error('Error in logEvents:', error);
  }
};

export { 
    winstonLogger, 
    pinoLogger 
};
