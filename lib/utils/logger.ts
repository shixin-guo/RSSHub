import path from 'node:path';
import winston from 'winston';
import { config } from '../config';

// Create base logger with default JSON format
const logger = winston.createLogger({
    level: config.loggerLevel,
    format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }), winston.format.json()),
});

// Add file transports if enabled
if (!config.noLogfiles) {
    // Add error log
    const errorLog = new winston.transports.File({
        filename: path.resolve('logs/error.log'),
    });
    // Set level after creation to avoid type error
    Object.assign(errorLog, { level: 'error' });
    logger.add(errorLog);

    // Add combined log
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
            const timestamp = config.showLoggerTimestamp ? `[${info.timestamp}] ` : '';
            return `${timestamp}${info.level}: ${info.message}`;
        })
    );

    logger.add(
        Object.assign(
            new winston.transports.Console({
                silent: process.env.NODE_ENV === 'test',
            }),
            {
                format: consoleFormat,
            }
        )
    );
}

export default logger;
