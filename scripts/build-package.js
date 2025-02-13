import { execSync } from 'node:child_process';
// No unused imports

function buildPackage() {
    try {
        // Clean dist
        execSync('rm -rf ./dist', { stdio: 'inherit' });

        // First copy all files
        execSync('cp -r lib dist/ && cp package.json dist/', { stdio: 'inherit' });

        // Then transpile TypeScript files
        execSync(
            'tsc --allowJs --noEmit false --noEmitOnError false --skipLibCheck --jsx react-jsx --target ESNext --module ESNext --moduleResolution node ./dist/pkg.ts ./dist/config.ts ./dist/app.ts ./dist/utils/logger.ts ./dist/utils/rand-user-agent.ts',
            { stdio: 'inherit' }
        );
    } catch {
        process.exit(1);
    }
}

buildPackage();
