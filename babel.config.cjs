module.exports = {
    presets: [
        ['@babel/preset-env', { 
            targets: { node: 'current' },
            modules: false
        }],
        '@babel/preset-typescript',
        ['@babel/preset-react', {
            runtime: 'automatic',
            throwIfNamespace: false
        }]
    ],
    plugins: ['@babel/plugin-transform-modules-commonjs'],
    ignore: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx']
};
