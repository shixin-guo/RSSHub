import { execSync } from 'node:child_process';

function buildPackage() {
    try {
        // Clean dist
        execSync('rm -rf ./dist', { stdio: 'inherit' });

        // Create dist directory and copy files
        execSync('mkdir -p dist/utils', { stdio: 'inherit' });
        execSync('cp lib/pkg.ts dist/index.ts', { stdio: 'inherit' });
        execSync('cp lib/config.ts lib/app.tsx dist/', { stdio: 'inherit' });
        execSync('cp lib/utils/logger.ts lib/utils/rand-user-agent.ts dist/utils/', { stdio: 'inherit' });

        // Transpile with babel
        execSync('babel dist --out-dir dist --extensions ".ts,.tsx" --config-file ./babel.config.cjs', { stdio: 'inherit' });

        // Copy package.json and clean up test files
        execSync('cp package.json dist/ && rm -rf dist/**/*.test.* dist/**/*.spec.*', { stdio: 'inherit' });

        // Create simple type definitions that avoid type checking
        execSync(
            `echo "declare module 'rsshub' {
            export function init(options?: any): Promise<void>;
            export function start(port?: number): Promise<void>;
            export function stop(): Promise<void>;
            export function request(path: string): Promise<any>;
            export interface Config {
                [key: string]: any;
            }
        }" > dist/index.d.ts`,
            { stdio: 'inherit' }
        );

        // Create a CJS wrapper for better compatibility
        execSync(
            `echo "const mod = require('./index.js');
module.exports = {
    init: mod.init,
    start: mod.start,
    stop: mod.stop,
    request: mod.request
};" > dist/index.cjs`,
            { stdio: 'inherit' }
        );
    } catch {
        process.exit(1);
    }
}

buildPackage();
