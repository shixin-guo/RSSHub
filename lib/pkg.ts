import { setConfig, type Config } from '@/config';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import logger from '@/utils/logger';

export interface RSSHubOptions {
    config?: Partial<Config>;
    routes?: string[]; // Paths to route modules to load
}

let app: Hono;
type ServerType = ReturnType<typeof serve>;
let currentServer: ServerType | undefined;

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

export const start = (port?: number): ServerType => {
    if (!app) {
        throw new Error('RSSHub not initialized. Call init() first');
    }
    if (currentServer) {
        logger.info('RSSHub already running');
        return currentServer;
    }

    const server = serve({
        fetch: app.fetch,
        port: port || 1200,
    });
    logger.info(`RSSHub package server started on port ${port || 1200}`);
    currentServer = server;
    return server;
};

export const stop = async () => {
    if (currentServer) {
        await currentServer.close();
        currentServer = undefined;
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

export { type Config } from '@/config';
