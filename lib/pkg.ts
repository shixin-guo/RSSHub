import { setConfig, type Config } from '@/config';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import logger from '@/utils/logger';

export interface RSSHubOptions {
    config?: Partial<Config>;
    routes?: string[]; // Paths to route modules to load
}

let app: Hono;
let server: any;

export const init = async (options: RSSHubOptions = {}) => {
    if (app) {
        logger.info('RSSHub already initialized');
        return;
    }

    setConfig(
        Object.assign(
            {
                IS_PACKAGE: true,
            },
            options.config
        )
    );
    app = (await import('@/app')).default;
};

export const start = (port?: number) => {
    if (!app) {
        throw new Error('RSSHub not initialized. Call init() first');
    }
    if (server) {
        logger.info('RSSHub already running');
        return server;
    }

    server = serve({
        fetch: app.fetch,
        port: port || 1200,
    });
    logger.info(`RSSHub package server started on port ${port || 1200}`);
    return server;
};

export const stop = async () => {
    if (server) {
        await server.close();
        server = null;
        logger.info('RSSHub package server stopped');
    }
};

export const request = async (path: string) => {
    if (!app) {
        throw new Error('RSSHub not initialized. Call init() first');
    }
    const res = await app.request(path);
    return res.json();
};

// Re-export types that may be useful for consumers


export {type Config} from '@/config';