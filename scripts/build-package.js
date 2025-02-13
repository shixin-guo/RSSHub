import { execSync } from 'node:child_process';
// No unused imports

function buildPackage() {
    try {
        // Clean dist
        execSync('rm -rf ./dist', { stdio: 'inherit' });

        // Compile TypeScript files
        execSync('tsc -p tsconfig.package.json', { stdio: 'inherit' });

        // Copy additional files
        execSync('cp -r lib/routes lib/utils lib/middleware lib/views dist/ && cp package.json dist/', { stdio: 'inherit' });
    } catch {
        process.exit(1);
    }
}

buildPackage();
