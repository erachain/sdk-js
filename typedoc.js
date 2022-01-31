module.exports = {
    out: "docs",
    inputFiles: [
        "./src/index.ts"
    ],
    exclude: [
        '**/__tests__/**/*',
        '**/__test_utils__/**/*',
        '**/__fixtures__/**/*',
        '**/testsuite/**/*'
    ],
    mode: 'file',
    excludeExternals: true,
    excludeNotExported: true,
    excludePrivate: true
};