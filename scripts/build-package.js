import { execSync } from 'node:child_process';
// No unused imports

function buildPackage() {
    try {
        // Clean dist
        execSync('rm -rf ./dist', { stdio: 'inherit' });

        // Compile core files first
        execSync('tsc --project tsconfig.package.json --verbose', { stdio: 'inherit' });

        // Then copy additional files
        execSync('cp -r lib/routes lib/utils lib/middleware lib/views dist/', { stdio: 'inherit' });
    } catch {
        process.exit(1);
    }
}

buildPackage();
