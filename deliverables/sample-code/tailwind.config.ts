import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            /* ─── Colors (from design-system.json) ──────────── */
            colors: {
                primary: {
                    DEFAULT: '#0A968C',
                    dark: '#087A72',
                    light: '#0CB5A8',
                },
                secondary: '#041E42',
                accent: {
                    DEFAULT: '#E8735A',
                    light: '#F4D2C1',
                },
                surface: '#F5F0EB',
                'hero-bg': '#DCEDFC',
                success: '#23C688',
                neutral: {
                    50: '#FAFBFC',
                    100: '#F5F0EB',
                    200: '#DCEDFC',
                    300: '#C4D1DC',
                    400: '#8C9AA8',
                    500: '#465B52',
                    600: '#333333',
                    700: '#222222',
                    800: '#1A1A1A',
                    900: '#0B2B3A',
                },
            },

            /* ─── Typography ────────────────────────────────── */
            fontFamily: {
                heading: ['"League Spartan"', 'system-ui', 'sans-serif'],
                body: ['Inter', 'system-ui', 'sans-serif'],
                accent: ['"Source Serif 4"', 'Georgia', 'serif'],
            },

            /* ─── Border Radius ─────────────────────────────── */
            borderRadius: {
                card: '20px',
                button: '7px',
            },

            /* ─── Shadows ───────────────────────────────────── */
            boxShadow: {
                card: '0 2px 8px rgba(0, 0, 0, 0.06)',
                'card-hover': '0 8px 24px rgba(0, 0, 0, 0.12)',
                nav: '0 4px 12px rgba(0, 0, 0, 0.08)',
                button_hover: '0 4px 16px rgba(10, 150, 140, 0.25)',
                elevated: '0 12px 32px rgba(0, 0, 0, 0.15)',
            },

            /* ─── Spacing ───────────────────────────────────── */
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem',
            },

            /* ─── Transition Duration ───────────────────────── */
            transitionDuration: {
                '250': '250ms',
                '400': '400ms',
            },
        },
    },
    plugins: [],
};

export default config;
