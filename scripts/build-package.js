import { execSync } from 'node:child_process';
// No unused imports

function buildPackage() {
    try {
        // Clean dist
        execSync('rm -rf ./dist', { stdio: 'inherit' });

        // First create dist directory
        execSync('mkdir -p dist', { stdio: 'inherit' });

        // Then transpile core files
        execSync('babel lib/pkg.ts lib/config.ts lib/app.tsx lib/utils/logger.ts lib/utils/rand-user-agent.ts --out-dir dist --extensions ".ts,.tsx" --copy-files', { stdio: 'inherit' });

        // Copy additional files
        execSync('cp -r lib/routes lib/utils lib/middleware lib/views dist/ && cp package.json dist/', { stdio: 'inherit' });

        // Create type definitions
        execSync('echo "declare module \'rsshub\';" > dist/index.d.ts', { stdio: 'inherit' });
    } catch {
        process.exit(1);
    }
}

buildPackage();
