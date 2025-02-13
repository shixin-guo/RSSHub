import { execSync } from 'node:child_process';
// No unused imports

function buildPackage() {
    try {
        // Clean dist
        execSync('rm -rf ./dist', { stdio: 'inherit' });

        // First create dist directory
        execSync('mkdir -p dist', { stdio: 'inherit' });

        // First copy all files to dist
        execSync('cp -r lib/* dist/', { stdio: 'inherit' });

        // Then transpile all TypeScript files
        execSync('babel dist --out-dir dist --extensions ".ts,.tsx" --config-file ./babel.config.cjs', { stdio: 'inherit' });

        // Generate type definitions
        execSync('tsc dist/pkg.ts --declaration --emitDeclarationOnly --outDir dist', { stdio: 'inherit' });

        // Copy package.json and clean up test files
        execSync('cp package.json dist/ && rm -rf dist/**/*.test.* dist/**/*.spec.*', { stdio: 'inherit' });

        // Create type definitions
        execSync('echo "declare module \'rsshub\';" > dist/index.d.ts', { stdio: 'inherit' });
    } catch {
        process.exit(1);
    }
}

buildPackage();
