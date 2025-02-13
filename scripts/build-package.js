import { execSync } from 'node:child_process';
// No unused imports

function buildPackage() {
    try {
        // Clean dist
        execSync('rm -rf ./dist', { stdio: 'inherit' });

        // First create dist directory
        execSync('mkdir -p dist', { stdio: 'inherit' });

        // Then transpile core files
        execSync('babel lib --out-dir dist --extensions ".ts,.tsx" --copy-files --config-file ./babel.config.cjs --out-file-extension .js', { stdio: 'inherit' });

        // Generate CJS version
        execSync('babel lib/pkg.ts --out-file dist/pkg.cjs --config-file ./babel.config.cjs --out-file-extension .cjs', { stdio: 'inherit' });

        // Copy package.json and clean up test files
        execSync('cp package.json dist/ && rm -rf dist/**/*.test.* dist/**/*.spec.*', { stdio: 'inherit' });

        // Create type definitions
        execSync('echo "declare module \'rsshub\';" > dist/index.d.ts', { stdio: 'inherit' });
    } catch {
        process.exit(1);
    }
}

buildPackage();
