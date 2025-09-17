import winston from 'winston';
import type { Request, Response, NextFunction } from 'express';
type LogArgs = [message: string, ...optionalParams: any[]];
export type AppLogger = {
    info: (...args: any[]) => void;
    error: (...args: any[]) => void;
    debug: (...args: any[]) => void;
};
declare const winstonLogger: winston.Logger;
declare const pinoLogger: import("pino").Logger<never, boolean>;
export declare const logger: {
    info: (message: string, ...optionalParams: any[]) => void | winston.Logger;
    error: (message: string, ...optionalParams: any[]) => void | winston.Logger;
    debug: (message: string, ...optionalParams: any[]) => void | winston.Logger;
};
export declare const requestLogger: (req: Request, res: Response, next: NextFunction) => void;
export declare const logEvents: (message: string, logFileName: string) => Promise<void>;
export { winstonLogger, pinoLogger };
