import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './lib/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            boxShadow: {
                glow: '0 0 0 1px rgba(255,255,255,0.08), 0 24px 60px rgba(0,0,0,0.45)',
            },
            backgroundImage: {
                'radial-grid':
                    'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.12) 1px, transparent 0)',
            },
            colors: {
                ink: {
                    950: '#04070c',
                    900: '#07111a',
                    800: '#0d1b28',
                },
                signal: {
                    500: '#f97316',
                    600: '#ea580c',
                },
            },
        },
    },
    plugins: [],
};

export default config;
