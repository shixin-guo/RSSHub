import { init, start, stop, request } from 'rsshub';

async function test() {
    try {
        await init();
        await start(3000);
        const data = await request('/twitter/user/DIYgod');
        process.stdout.write(`Test successful: ${JSON.stringify(data)}\n`);
    } catch (error) {
        process.stderr.write(`Test failed: ${error}\n`);
        process.exit(1);
    } finally {
        await stop();
    }
}

test();
