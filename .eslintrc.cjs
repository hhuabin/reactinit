module.exports = {
    root: true,
    env: { browser: true, es2020: true, node: false },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
    ],
    ignorePatterns: ['dist', '.eslintrc.cjs'],
    parser: '@typescript-eslint/parser',
    plugins: ['react-refresh'],
    rules: {
        'react-refresh/only-export-components': [
            'warn',
            { allowConstantExport: true },
        ],
        'react-hooks/exhaustive-deps': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'no-var': ['error'],         // use const
        'prefer-const': ['error'],   // not use let
        // 'no-duplicate-imports': ['error'],
        'eol-last': ['error', 'always'],  // end of line
        'no-trailing-spaces': ['error', { 'skipBlankLines': false, 'ignoreComments': false }],   // no end of spacing
        'comma-dangle': ['error', 'always-multiline'],   // use , in object and array
        'semi': ['warn', 'never'],       // no ;
        'indent': ['warn', 4],       // 4 spaces
        'no-tabs': ['warn'],         // disabled tab
        'no-mixed-spaces-and-tabs': ['warn'],   // disabled mixed
        'keyword-spacing': ['warn', { 'before': true, 'after': true }],  // add spacing before and after keywords
        'max-lines': ['warn', 300],  // maximum 300 of lines per file
        'no-multiple-empty-lines': ['warn', { 'max': 2 }],    // only 2 empty lines in file
    },
}
