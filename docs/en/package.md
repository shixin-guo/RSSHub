# Using RSSHub as a Package

RSSHub can be used as a Node.js package in your application:

```javascript
import { init, start, stop, request } from 'rsshub';

// Initialize with custom config
await init({
  config: {
    cache: {
      type: 'memory',
      routeExpire: 300
    }
  }
});

// Start the service
await start(3000);

// Make requests
const data = await request('/twitter/user/DIYgod');

// Stop the service
await stop();
```

## Installation

```bash
npm install rsshub
```

Or with other package managers:
```bash
pnpm add rsshub
yarn add rsshub
```

## API Reference

### init(options?: RSSHubOptions)
Initialize the RSSHub service with optional configuration.

```typescript
interface RSSHubOptions {
  config?: Partial<Config>;  // RSSHub configuration options
  routes?: string[];        // Paths to route modules to load
}
```

### start(port?: number)
Start the RSSHub HTTP server. Returns the server instance.

### stop()
Stop the RSSHub HTTP server and cleanup resources.

### request(path: string)
Make a request to a RSSHub route and return the parsed JSON response.

## Example with Error Handling

```javascript
import { init, start, stop, request } from 'rsshub';

async function main() {
  try {
    // Initialize RSSHub
    await init({
      config: {
        cache: {
          type: 'memory',
          routeExpire: 300
        },
        ua: 'MyService/1.0'
      }
    });

    // Start the server
    const server = await start(3000);
    console.log('RSSHub server started');

    // Make requests
    try {
      const data = await request('/twitter/user/DIYgod');
      console.log('Feed data:', data);
    } catch (err) {
      console.error('Request failed:', err);
    }

  } catch (err) {
    console.error('Failed to start RSSHub:', err);
  } finally {
    // Always cleanup
    await stop();
  }
}

main();
```

## Notes
- Node.js version >= 22 is required
- The service must be initialized with `init()` before making requests
- Always call `stop()` when you're done to cleanup resources
- All API methods are async and return promises
