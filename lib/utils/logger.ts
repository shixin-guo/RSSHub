import path from 'node:path';
import winston from 'winston';
import { config } from '../config';

// Create base logger with default JSON format
const logger = winston.createLogger({
    level: config.loggerLevel,
    format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }), winston.format.json()),
    transports: [
        // Add file transports if enabled
        ...(config.noLogfiles
            ? []
            : [
                  new winston.transports.File({
                      filename: path.resolve('logs/error.log'),
                      level: 'error',
                  }),
                  new winston.transports.File({
                      filename: path.resolve('logs/combined.log'),
                  }),
              ]),
        // Add console transport for development
        ...(config.isPackage
            ? []
            : [
                  new winston.transports.Console({
                      format: winston.format.combine(
                          winston.format.colorize(),
                          winston.format.printf((info) => {
                              const timestamp = config.showLoggerTimestamp ? `[${info.timestamp}] ` : '';
                              return `${timestamp}${info.level}: ${info.message}`;
                          })
                      ),
                      silent: process.env.NODE_ENV === 'test',
                  }),
              ]),
    ],
});

export default logger;
