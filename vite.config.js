import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/js/app.tsx',
                'resources/css/app.css',
            ],
            refresh: true,
        }),
        react(),
    ],
    // Si l'erreur persiste à cause de tsconfig, on force la suppression de l'option conflictuelle ici :
    esbuild: {
        jsx: 'automatic',
    },
    server: {
        host: '0.0.0.0',
        hmr: {
            host: 'localhost',
        },
    },
});