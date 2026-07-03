import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
        './resources/js/**/*.tsx',
        './resources/js/**/*.js',
        './resources/js/**/*.ts',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Hanken Grotesk', ...defaultTheme.fontFamily.sans],
                serif: ['Spectral', ...defaultTheme.fontFamily.serif],
                mono: ['Spline Sans Mono', ...defaultTheme.fontFamily.mono],
                display: ['Spectral', ...defaultTheme.fontFamily.serif],
            },
            colors: {
                cream: {
                    DEFAULT: '#f4eddf',
                    50: '#fbf6ec',
                },
                ink: {
                    DEFAULT: '#2a2521',
                    900: '#211d19',
                },
                forest: {
                    DEFAULT: '#2d3f31',
                    600: '#3e5641',
                },
                copper: {
                    DEFAULT: '#bc6b43',
                    300: '#c99360',
                },
                gold: '#d9a968',
                muted: {
                    DEFAULT: '#52493e',
                    400: '#8a8174',
                    500: '#6e6557',
                },
                onForest: {
                    DEFAULT: '#c5cfc0',
                    2: '#d8e0d4',
                },
                brand: {
                    50: '#fbf6ec',
                    100: '#f4eddf',
                    200: '#d8e0d4',
                    300: '#c5cfc0',
                    400: '#8a8174',
                    500: '#bc6b43',
                    600: '#2d3f31',
                    700: '#211d19',
                    800: '#2a2521',
                    900: '#2a2521',
                },
                surface: '#f4eddf',
                background: '#fbf6ec',
            },
            boxShadow: {
                'premium': '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
                'premium-md': '0 4px 12px rgba(0, 0, 0, 0.06)',
                'premium-lg': '0 8px 24px rgba(0, 0, 0, 0.08)',
                'premium-hover': '0 8px 24px rgba(0, 0, 0, 0.08)',
                'glow-brand': '0 0 20px rgba(59, 130, 246, 0.15)',
            },
            borderRadius: {
                '2xl': '1rem',
                '3xl': '1.25rem',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease',
                'slide-up': 'slideUp 0.3s ease',
                'slide-down': 'slideDown 0.25s ease',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(12px) scale(0.98)' },
                    '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
                },
                slideDown: {
                    '0%': { opacity: '0', transform: 'translateY(-8px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },

    plugins: [forms],
};
