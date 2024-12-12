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
        'unicode-bom': ['warn', 'never'],                  // must use utf-8
        'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        'react-hooks/exhaustive-deps': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',      // 避免滥用 any
        '@typescript-eslint/no-inferrable-types': 'off',   // 禁止对推断类型的多余注解
        '@typescript-eslint/consistent-type-imports': ['warn', { 'prefer': 'type-imports' }],      // 强制使用 type imports
        'no-var': ['error'],                               // use const
        'prefer-const': ['error'],                         // not use let
        'indent': ['warn', 4, { 'MemberExpression': 'off' }],      // 4 spaces
        'no-tabs': ['warn'],                                       // disabled tab
        'no-mixed-spaces-and-tabs': ['warn'],                      // disabled mixed
        'keyword-spacing': ['warn', { 'before': true, 'after': true }],                            // add spacing before and after keywords
        'object-curly-spacing': ['warn', 'always'],                // add spacing in object
        'comma-dangle': ['error', 'always-multiline'],             // use , end in object and array
        'semi': ['warn', 'never'],                                 // no end of spacing ;
        'no-trailing-spaces': ['warn', { 'skipBlankLines': false, 'ignoreComments': false }],      // no end of spacing
        'no-multiple-empty-lines': ['warn', { 'max': 2 }],         // max 2 empty lines in file
        'eol-last': ['error', 'always'],                           // file end of empty line
        'max-lines': ['warn', 300],                                // maximum 300 of lines per file
    },
}
