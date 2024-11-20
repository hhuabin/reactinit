/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx}',
        './src/components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        colors: {
            'color-primary': '#1677FF',
        },
        extend: {
            spacing: {
                unit1: '0.0625rem',
                unit3: '0.1875rem',
                unit5: '0.3125rem',
                unit7: '0.4375rem',
                unit9: '0.5625rem',
                unit11: '0.6875rem',
                unit13: '0.8125rem',
                unit15: '0.9375rem',
                unit18: '1.125rem',
                unit22: '1.375rem',
                unit26: '1.625rem',
                unit30: '1.875rem',
            },
        },
    },
    plugins: [],
}
