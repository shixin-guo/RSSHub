import { execSync } from 'node:child_process';
// No unused imports

function buildPackage() {
    try {
        // Clean dist
        execSync('rm -rf ./dist', { stdio: 'inherit' });

        // First transpile core files
        execSync('babel lib/pkg.ts lib/config.ts lib/app.ts lib/utils/logger.ts lib/utils/rand-user-agent.ts --out-dir dist --extensions ".ts,.tsx"', { stdio: 'inherit' });

        // Then copy additional files
        execSync('cp package.json dist/ && cp -r lib/routes lib/utils lib/middleware lib/views dist/', { stdio: 'inherit' });

        // Create type definitions
        execSync('echo "declare module \'rsshub\';" > dist/index.d.ts', { stdio: 'inherit' });
    } catch {
        process.exit(1);
    }
}

buildPackage();
