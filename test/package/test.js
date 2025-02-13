import { init, start, stop, request } from 'rsshub';

async function test() {
  try {
    await init();
    await start(3000);
    const data = await request('/twitter/user/DIYgod');
    console.log('Test successful:', data);
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  } finally {
    await stop();
  }
}

test();
