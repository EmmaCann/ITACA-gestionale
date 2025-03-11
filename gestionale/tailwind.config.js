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
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                marcellus: ['Marcellus', 'serif'],
                marcellusSC: ['Marcellus SC', 'serif'],
                inter: ['Inter', 'serif'],
            },
            colors: {
                background: "#ECEFF2",
                bluPrimary: "#3DA4DD", 
                bluSecondary: "#6BB2DF",
                pinkPrimary: "#BB4E97",
                pinkSecondary: "#D084B7",
                navbar: "#C8C8C8",
                navbarActive: "#ECEFF2",
                bgContainer:"#DFE0E0",
                
            }
        },
    },
    plugins: [],
};
