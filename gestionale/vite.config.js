// import {defineConfig} from 'vite';
// import laravel from 'laravel-vite-plugin';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//     plugins: [
//         laravel({
//             input: ['resources/css/app.css', 'resources/js/app.jsx'],
//             refresh: true,
//         }),
//         react(),
//     ],
//     resolve: name => {
//         const pages = import.meta.glob('./Pages/**/*.jsx', {eager: true})
//         return pages[`./Pages/${name}.jsx`]
//     },
// });
import {defineConfig} from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.jsx', {eager: true})
        return pages[`./Pages/${name}.jsx`]
    },
    define: {
        'import.meta.env.VITE_API_URL': JSON.stringify('https://www.itacariabilitazione.it')
    }
});