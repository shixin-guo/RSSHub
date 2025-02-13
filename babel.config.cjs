module.exports = {
    presets: [
        ['@babel/preset-env', { 
            targets: { node: 'current' },
            modules: 'commonjs'
        }],
        '@babel/preset-typescript',
        ['@babel/preset-react', {
            runtime: 'automatic',
            throwIfNamespace: false
        }]
    ],
    ignore: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx']
};
