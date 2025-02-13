import { execSync } from 'node:child_process';
// No unused imports

function buildPackage() {
    try {
        // Clean dist
        execSync('rm -rf ./dist', { stdio: 'inherit' });

        // First copy all files
        execSync('cp -r lib/* dist/ && cp package.json dist/', { stdio: 'inherit' });

        // Then transpile TypeScript files
        execSync('cd dist && babel pkg.ts config.ts app.ts utils/logger.ts utils/rand-user-agent.ts -d . --extensions ".ts,.tsx"', { stdio: 'inherit' });

        // Create type definitions
        execSync('echo "declare module \'rsshub\';" > dist/index.d.ts', { stdio: 'inherit' });
    } catch {
        process.exit(1);
    }
}

buildPackage();
