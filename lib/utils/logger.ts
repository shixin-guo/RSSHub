import path from 'node:path';
import winston from 'winston';
import { config } from '../config';

const logger = winston.createLogger({
    level: config.loggerLevel,
    format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }), winston.format.json()),
});

// Add file transports if enabled
if (!config.noLogfiles) {
    const errorTransport = new winston.transports.File({
        filename: path.resolve('logs/error.log'),
    });
    errorTransport.level = 'error';
    logger.add(errorTransport);

    logger.add(
        new winston.transports.File({
            filename: path.resolve('logs/combined.log'),
        })
    );
}

// Add console transport for development
if (!config.isPackage) {
    const consoleFormat = winston.format.combine(
        winston.format.colorize(),
        winston.format.printf((info) => {
            const infoLevel = config.showLoggerTimestamp ? `[${info.timestamp}] ${info.level}` : info.level;
            return `${infoLevel}: ${info.message}`;
        })
    );

    logger.add(
        new winston.transports.Console({
            format: consoleFormat,
            silent: process.env.NODE_ENV === 'test',
        })
    );
}

export default logger;
