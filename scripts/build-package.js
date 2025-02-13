import { execSync } from 'node:child_process';
// No unused imports

function buildPackage() {
    try {
        // Clean dist
        execSync('rm -rf ./dist', { stdio: 'inherit' });

        // First compile TypeScript files
        execSync('tsc -p tsconfig.package.json', { stdio: 'inherit' });

        // Then copy additional files
        execSync('cp package.json dist/ && cp -r lib/routes lib/utils lib/middleware lib/views dist/', { stdio: 'inherit' });
    } catch {
        process.exit(1);
    }
}

buildPackage();
