import pkg from 'rsshub';
const { init, start, stop, request } = pkg;

async function test() {
    try {
        await init({
            config: {
                cache: {
                    type: 'memory',
                    routeExpire: 300,
                },
            },
        });

        await start(3000);
        process.stdout.write('Server started on port 3000\n');

        const data = await request('/twitter/user/DIYgod');
        process.stdout.write(`Request successful: ${JSON.stringify(data)}\n`);

        await stop();
        process.stdout.write('Server stopped\n');
    } catch (error) {
        process.stderr.write(`Test failed: ${error}\n`);
        process.exit(1);
    }
}

test();
