import path from 'node:path';
import winston from 'winston';
import { config } from '../config';

const transports: winston.transport[] = [];
if (!config.noLogfiles) {
    const errorTransport = new winston.transports.File({
        filename: path.resolve('logs/error.log'),
    }) as winston.transport;
    errorTransport.level = 'error';

    const combinedTransport = new winston.transports.File({
        filename: path.resolve('logs/combined.log'),
    }) as winston.transport;

    transports.push(errorTransport, combinedTransport);
}
const logger = winston.createLogger({
    level: config.loggerLevel,
    format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }), winston.format.json()),
    transports,
}) as winston.Logger;

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (!config.isPackage) {
    const consoleTransport = new winston.transports.Console({
        silent: process.env.NODE_ENV === 'test',
    }) as winston.transport;

    consoleTransport.format = winston.format.combine(
        winston.format.colorize(),
        winston.format.printf((info) => {
            const timestamp = config.showLoggerTimestamp ? `[${info.timestamp}] ` : '';
            return `${timestamp}${info.level}: ${info.message}`;
        })
    );

    logger.add(consoleTransport);
}

export default logger;
