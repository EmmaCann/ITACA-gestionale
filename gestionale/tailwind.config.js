import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/**/*.blade.php',
        './resources/**/*.js',
        './resources/**/*.jsx',
        './resources/**/*.vue',
    ],
    theme: {
        extend: {
            fontFamily: {
                //TODO aggiungere font Marcellus e Marcellus SC
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                background: "#ECEFF2",
                bluPrimary: "#3DA4DD",
                pinkPrimary: "#BB4E97"
                
            }
        },
    },
    plugins: [],
};
