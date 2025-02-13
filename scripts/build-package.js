import { execSync } from 'node:child_process';
// No unused imports

function buildPackage() {
    try {
        // Clean dist
        execSync('rm -rf ./dist', { stdio: 'inherit' });

        // Copy files
        execSync('cp -r ./lib ./dist', { stdio: 'inherit' });

        // Compile TypeScript files
        execSync('tsc --build tsconfig.package.json --verbose', { stdio: 'inherit' });
    } catch {
        process.exit(1);
    }
}

buildPackage();
