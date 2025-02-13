import { execSync } from 'node:child_process';
// No unused imports

function buildPackage() {
    try {
        // Clean dist
        execSync('rm -rf ./dist', { stdio: 'inherit' });

        // First create dist directory
        execSync('mkdir -p dist', { stdio: 'inherit' });

        // First compile TypeScript
        execSync('tsc --project tsconfig.json', { stdio: 'inherit' });

        // Then transpile with babel
        execSync('babel dist --out-dir dist --extensions ".js,.jsx" --config-file ./babel.config.cjs', { stdio: 'inherit' });

        // Copy package.json and clean up test files
        execSync('cp package.json dist/ && rm -rf dist/**/*.test.* dist/**/*.spec.*', { stdio: 'inherit' });

        // Copy package.json and clean up test files
        execSync('cp package.json dist/ && rm -rf dist/**/*.test.* dist/**/*.spec.*', { stdio: 'inherit' });

        // Create type definitions
        execSync('echo "declare module \'rsshub\';" > dist/index.d.ts', { stdio: 'inherit' });
    } catch {
        process.exit(1);
    }
}

buildPackage();
