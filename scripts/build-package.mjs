import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
        execSync('babel lib/pkg.ts --out-file dist/pkg.mjs --presets=@babel/preset-typescript,@babel/preset-env --no-babelrc --source-type module', { stdio: 'inherit' });
        execSync('babel lib/config.ts --out-file dist/config.mjs --presets=@babel/preset-typescript,@babel/preset-env --no-babelrc --source-type module', { stdio: 'inherit' });
        execSync('babel lib/app.tsx --out-file dist/app.mjs --presets=@babel/preset-typescript,@babel/preset-react,@babel/preset-env --no-babelrc --source-type module', { stdio: 'inherit' });

        // Then create CJS versions
        execSync('babel dist/pkg.mjs --out-file dist/pkg.cjs --presets=@babel/preset-env --plugins=@babel/plugin-transform-modules-commonjs', { stdio: 'inherit' });
        execSync('babel dist/config.mjs --out-file dist/config.cjs --presets=@babel/preset-env --plugins=@babel/plugin-transform-modules-commonjs', { stdio: 'inherit' });
        execSync('babel dist/app.mjs --out-file dist/app.cjs --presets=@babel/preset-env --plugins=@babel/plugin-transform-modules-commonjs', { stdio: 'inherit' });

        // Create package entry points
        execSync('echo "export * from \'./pkg.mjs\';" > dist/index.js', { stdio: 'inherit' });
        execSync('echo "module.exports = require(\'./pkg.cjs\');" > dist/index.cjs', { stdio: 'inherit' });

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
    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
}

buildPackage();
