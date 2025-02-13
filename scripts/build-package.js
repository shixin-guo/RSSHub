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

        // First compile TypeScript to ESM
        execSync('babel dist --out-dir dist --extensions ".ts,.tsx" --config-file ./babel.config.cjs --presets=@babel/preset-typescript,@babel/preset-react --no-babelrc', { stdio: 'inherit' });

        // Create CJS version
        execSync('babel dist/index.js --out-file dist/index.cjs --presets=@babel/preset-env --plugins=@babel/plugin-transform-modules-commonjs', { stdio: 'inherit' });

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
        execSync(`echo "module.exports = require('./index.js');" > dist/index.cjs`, { stdio: 'inherit' });
    } catch {
        process.exit(1);
    }
}

buildPackage();
