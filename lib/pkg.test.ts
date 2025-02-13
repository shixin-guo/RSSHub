import { describe, expect, it, afterEach } from 'vitest';
import { init, start, stop, request } from './pkg';

describe('pkg', () => {
    afterEach(async () => {
        await stop();
    });

    it('config', async () => {
        await init({
            config: {
                ua: 'mock',
            },
        });
        const { config } = await import('./config');
        expect(config.ua).toBe('mock');
    });

    it('request', async () => {
        await init();
        const data = await request('/test/1');
        expect(data).toMatchObject({
            atomlink: 'http://localhost/test/1',
            title: 'Test 1',
            itunes_author: null,
            link: 'https://github.com/DIYgod/RSSHub',
            item: [
                {
                    title: 'Title1',
                    description: 'Description1',
                    pubDate: 'Mon, 31 Dec 2018 15:59:50 GMT',
                    link: 'https://github.com/DIYgod/RSSHub/issues/1',
                    author: 'DIYgod1',
                },
                {
                    title: 'Title2',
                    description: 'Description2',
                    pubDate: 'Mon, 31 Dec 2018 15:59:40 GMT',
                    link: 'https://github.com/DIYgod/RSSHub/issues/2',
                    author: 'DIYgod2',
                },
                {
                    title: 'Title3',
                    description: 'Description3',
                    pubDate: 'Mon, 31 Dec 2018 15:59:30 GMT',
                    link: 'https://github.com/DIYgod/RSSHub/issues/3',
                    author: 'DIYgod3',
                },
                {
                    title: 'Title4',
                    description: 'Description4',
                    pubDate: 'Mon, 31 Dec 2018 15:59:20 GMT',
                    link: 'https://github.com/DIYgod/RSSHub/issues/4',
                    author: 'DIYgod4',
                },
                {
                    title: 'Title5',
                    description: 'Description5',
                    pubDate: 'Mon, 31 Dec 2018 15:59:10 GMT',
                    link: 'https://github.com/DIYgod/RSSHub/issues/5',
                    author: 'DIYgod5',
                },
            ],
            allowEmpty: false,
        });
    });

    it('error', async () => {
        await init();
        try {
            await request('/test/error');
        } catch (error) {
            expect(error).toBe('Error test');
        }
    });

    describe('lifecycle', () => {
        it('should start and stop server', async () => {
            await init();
            const server = await start(3001);
            expect(server).toBeDefined();
            await stop();
        });

        it('should handle multiple init calls gracefully', async () => {
            await init();
            await init(); // Should not throw
            const server = start(3003);
            expect(server).toBeDefined();
        });

        it('should handle multiple start calls gracefully', async () => {
            await init();
            const server1 = start(3004);
            const server2 = start(3004); // Should return same server
            expect(server1).toBe(server2);
        });

        it('should handle stop when not started', async () => {
            await init();
            await stop(); // Should not throw
        });

        it('should throw when requesting without init', async () => {
            await expect(request('/test/1')).rejects.toThrow('RSSHub not initialized');
        });
    });
});
