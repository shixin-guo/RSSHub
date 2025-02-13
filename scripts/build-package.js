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
        execSync('babel dist --out-dir dist --extensions ".ts,.tsx" --config-file ./babel.config.cjs --plugins @babel/plugin-transform-modules-commonjs', { stdio: 'inherit' });

        // Copy package.json and clean up test files
        execSync('cp package.json dist/ && rm -rf dist/**/*.test.* dist/**/*.spec.*', { stdio: 'inherit' });

        // Create simple type definitions that avoid type checking
        execSync(
            `echo "declare module 'rsshub' {
            interface RSSHub {
                init(options?: any): Promise<void>;
                start(port?: number): Promise<void>;
                stop(): Promise<void>;
                request(path: string): Promise<any>;
            }
            declare const pkg: RSSHub;
            export default pkg;
            export interface Config {
                [key: string]: any;
            }
        }" > dist/index.d.ts`,
            { stdio: 'inherit' }
        );

        // Create a CJS wrapper for better compatibility
        execSync(`echo "export { default } from './index.js';" > dist/index.cjs`, { stdio: 'inherit' });
    } catch {
        process.exit(1);
    }
}

buildPackage();
