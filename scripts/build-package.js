import { execSync } from 'node:child_process';
// No unused imports

function buildPackage() {
    try {
        // Clean dist
        execSync('rm -rf ./dist', { stdio: 'inherit' });

        // First create dist directory
        execSync('mkdir -p dist', { stdio: 'inherit' });

        // First copy only the package files
        execSync('mkdir -p dist/lib/utils', { stdio: 'inherit' });
        execSync('cp lib/pkg.ts lib/config.ts lib/app.tsx lib/utils/logger.ts lib/utils/rand-user-agent.ts dist/lib/', { stdio: 'inherit' });

        // Then transpile with babel
        execSync('babel dist/lib --out-dir dist --extensions ".ts,.tsx" --config-file ./babel.config.cjs', { stdio: 'inherit' });

        // Generate type definitions
        execSync('tsc --project tsconfig.json --declaration --emitDeclarationOnly --outDir dist', { stdio: 'inherit' });

        // Copy package.json and clean up test files
        execSync('cp package.json dist/ && rm -rf dist/**/*.test.* dist/**/*.spec.*', { stdio: 'inherit' });

        // Create type definitions
        execSync('echo "declare module \'rsshub\';" > dist/index.d.ts', { stdio: 'inherit' });
    } catch {
        process.exit(1);
    }
}

buildPackage();
