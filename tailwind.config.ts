import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class', // Keep as 'class' but never apply .dark class
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Default shadcn/ui colors
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },

        // Industrial Theme Colors (HSL Variable-based)
        'industrial-background': 'hsl(var(--industrial-background))',
        'industrial-foreground': 'hsl(var(--industrial-foreground))',
        'industrial-card': {
          DEFAULT: 'hsl(var(--industrial-card))',
          foreground: 'hsl(var(--industrial-card-foreground))',
        },
        'industrial-popover': {
          DEFAULT: 'hsl(var(--industrial-popover))',
          foreground: 'hsl(var(--industrial-popover-foreground))',
        },
        'industrial-primary': {
          DEFAULT: 'hsl(var(--industrial-primary))',
          foreground: 'hsl(var(--industrial-primary-foreground))',
        },
        'industrial-secondary': {
          DEFAULT: 'hsl(var(--industrial-secondary))',
          foreground: 'hsl(var(--industrial-secondary-foreground))',
        },
        'industrial-muted': {
          DEFAULT: 'hsl(var(--industrial-muted))',
          foreground: 'hsl(var(--industrial-muted-foreground))',
        },
        'industrial-accent': {
          DEFAULT: 'hsl(var(--industrial-accent))',
          foreground: 'hsl(var(--industrial-accent-foreground))',
        },
        'industrial-destructive': {
          DEFAULT: 'hsl(var(--industrial-destructive))',
          foreground: 'hsl(var(--industrial-destructive-foreground))',
        },
        'industrial-border': 'hsl(var(--industrial-border))',
        'industrial-input': 'hsl(var(--industrial-input))',
        'industrial-ring': 'hsl(var(--industrial-ring))',

        // Industrial Theme Colors
        industrial: {
          // Gunmetal Grey variants
          gunmetal: {
            50: '#f8f9fa',
            100: '#e9ecef',
            200: '#dee2e6',
            300: '#ced4da',
            400: '#adb5bd',
            500: '#6c757d',
            600: '#495057',
            700: '#343a40',
            800: '#2C3E50', // Primary gunmetal
            900: '#34495E', // Secondary gunmetal
          },
          // Navy Blue variants
          navy: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1E3A8A', // Primary navy
            900: '#1E40AF', // Secondary navy
          },
          // Safety Yellow variants
          safety: {
            50: '#fefce8',
            100: '#fef9c3',
            200: '#fef08a',
            300: '#FDE047', // Primary safety yellow
            400: '#facc15',
            500: '#EAB308', // Secondary safety yellow
            600: '#ca8a04',
            700: '#a16207',
            800: '#854d0e',
            900: '#713f12',
          },
        },

        // Legacy Industrial color palette for backward compatibility
        'industrial-dark': '#2C3E50',
        'industrial-light': '#34495E',
        'industrial-navy': '#1E3A8A',
        'industrial-navy-light': '#1E40AF',
        'industrial-yellow': '#FDE047',
        'industrial-yellow-dark': '#EAB308',
      },

      fontFamily: {
        // Industrial Typography with CSS variables
        'industrial-heading': [
          'var(--font-industrial-heading)',
          'Oswald',
          'Bebas Neue',
          'Arial Black',
          'sans-serif',
        ],
        'industrial-display': [
          'var(--font-industrial-display)',
          'Bebas Neue',
          'Oswald',
          'Impact',
          'Arial Black',
          'sans-serif',
        ],
        'industrial-body': [
          'var(--font-industrial-body)',
          'Source Sans Pro',
          'Inter',
          'Roboto',
          'system-ui',
          'sans-serif',
        ],
        'industrial-secondary': [
          'var(--font-industrial-secondary)',
          'Inter',
          'Roboto',
          'system-ui',
          'sans-serif',
        ],
        'industrial-mono': [
          'var(--font-industrial-mono)',
          'JetBrains Mono',
          'Fira Code',
          'Consolas',
          'monospace',
        ],
        'industrial-roboto': [
          'var(--font-industrial-roboto)',
          'Roboto',
          'system-ui',
          'sans-serif',
        ],

        // Aliases for easier use
        body: [
          'var(--font-industrial-body)',
          'Source Sans Pro',
          'system-ui',
          'sans-serif',
        ],
        heading: ['var(--font-industrial-heading)', 'Oswald', 'sans-serif'],
        display: ['var(--font-industrial-display)', 'Bebas Neue', 'sans-serif'],
        mono: ['var(--font-industrial-mono)', 'JetBrains Mono', 'monospace'],
      },

      backgroundImage: {
        // Metal and industrial textures
        'metal-grid':
          'linear-gradient(90deg, rgba(44,62,80,0.1) 1px, transparent 1px), linear-gradient(rgba(44,62,80,0.1) 1px, transparent 1px)',
        'brushed-steel':
          'linear-gradient(90deg, rgba(108,117,125,0.1) 0%, rgba(108,117,125,0.05) 50%, rgba(108,117,125,0.1) 100%)',
        'industrial-gradient':
          'linear-gradient(135deg, #2C3E50 0%, #34495E 50%, #1E3A8A 100%)',
        'safety-gradient': 'linear-gradient(135deg, #FDE047 0%, #EAB308 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'metal-pattern':
          'linear-gradient(45deg, #2C3E50 25%, transparent 25%, transparent 75%, #2C3E50 75%), linear-gradient(45deg, #2C3E50 25%, transparent 25%, transparent 75%, #2C3E50 75%)',
      },

      backgroundSize: {
        'grid-sm': '20px 20px',
        'grid-md': '40px 40px',
        'grid-lg': '60px 60px',
        metal: '20px 20px',
      },

      backgroundPosition: {
        metal: '0 0, 10px 10px',
      },

      boxShadow: {
        industrial:
          '0 4px 6px -1px rgba(44, 62, 80, 0.1), 0 2px 4px -1px rgba(44, 62, 80, 0.06)',
        'industrial-lg':
          '0 10px 15px -3px rgba(44, 62, 80, 0.1), 0 4px 6px -2px rgba(44, 62, 80, 0.05)',
        safety:
          '0 4px 6px -1px rgba(253, 224, 71, 0.3), 0 2px 4px -1px rgba(234, 179, 8, 0.2)',
        'inset-steel': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.1)',
      },

      borderRadius: {
        industrial: '2px',
        gear: '50%',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        'industrial-sm': '0.125rem',
        'industrial-md': '0.375rem',
        'industrial-lg': '0.5rem',
        'industrial-xl': '0.75rem',
        'industrial-2xl': '1rem',
      },

      spacing: {
        grid: '1.5rem',
        industrial: '0.75rem',
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
        '42': '10.5rem',
        '46': '11.5rem',
        '50': '12.5rem',
        '54': '13.5rem',
        '58': '14.5rem',
        '62': '15.5rem',
        '66': '16.5rem',
        '70': '17.5rem',
        '74': '18.5rem',
        '78': '19.5rem',
        '82': '20.5rem',
        '86': '21.5rem',
        '90': '22.5rem',
        '94': '23.5rem',
        '98': '24.5rem',
        'industrial-xs': '0.375rem',
        'industrial-sm': '0.5rem',
        'industrial-md': '0.75rem',
        'industrial-lg': '1rem',
        'industrial-xl': '1.5rem',
        'industrial-2xl': '2rem',
        'industrial-3xl': '3rem',
      },

      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'gear-rotate': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(253, 224, 71, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(253, 224, 71, 0.8)' },
        },
        'skeleton-shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'gear-rotate': 'gear-rotate 20s linear infinite',
        'bounce-subtle': 'bounce-subtle 2s infinite',
        'pulse-glow': 'pulse-glow 2s infinite',
        'gear-spin': 'spin 8s linear infinite',
        'gear-reverse': 'spin 8s linear infinite reverse',
        'industrial-pulse': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'skeleton-shimmer': 'skeleton-shimmer 2s infinite',
      },

      fontSize: {
        // Industrial Typography Scale
        'industrial-xs': [
          '0.75rem',
          { lineHeight: '1rem', fontWeight: '600', letterSpacing: '0.025em' },
        ],
        'industrial-sm': [
          '0.875rem',
          {
            lineHeight: '1.25rem',
            fontWeight: '600',
            letterSpacing: '0.025em',
          },
        ],
        'industrial-base': [
          '1rem',
          { lineHeight: '1.5rem', fontWeight: '500', letterSpacing: '0' },
        ],
        'industrial-lg': [
          '1.125rem',
          { lineHeight: '1.75rem', fontWeight: '600', letterSpacing: '0' },
        ],
        'industrial-xl': [
          '1.25rem',
          {
            lineHeight: '1.75rem',
            fontWeight: '700',
            letterSpacing: '-0.025em',
          },
        ],
        'industrial-2xl': [
          '1.5rem',
          { lineHeight: '2rem', fontWeight: '700', letterSpacing: '-0.025em' },
        ],
        'industrial-3xl': [
          '1.875rem',
          {
            lineHeight: '2.25rem',
            fontWeight: '800',
            letterSpacing: '-0.025em',
          },
        ],
        'industrial-4xl': [
          '2.25rem',
          {
            lineHeight: '2.5rem',
            fontWeight: '800',
            letterSpacing: '-0.025em',
          },
        ],
        'industrial-5xl': [
          '3rem',
          { lineHeight: '3rem', fontWeight: '900', letterSpacing: '-0.025em' },
        ],
        'industrial-6xl': [
          '3.75rem',
          {
            lineHeight: '3.75rem',
            fontWeight: '900',
            letterSpacing: '-0.025em',
          },
        ],
        'industrial-7xl': [
          '4.5rem',
          { lineHeight: '4.5rem', fontWeight: '900', letterSpacing: '-0.05em' },
        ],
        'industrial-8xl': [
          '6rem',
          { lineHeight: '6rem', fontWeight: '900', letterSpacing: '-0.05em' },
        ],
        'industrial-9xl': [
          '8rem',
          { lineHeight: '8rem', fontWeight: '900', letterSpacing: '-0.05em' },
        ],

        // Display Typography (for hero sections, banners)
        'display-sm': [
          '2.25rem',
          {
            lineHeight: '2.5rem',
            fontWeight: '900',
            letterSpacing: '-0.025em',
          },
        ],
        'display-md': [
          '2.875rem',
          {
            lineHeight: '3.25rem',
            fontWeight: '900',
            letterSpacing: '-0.025em',
          },
        ],
        'display-lg': [
          '3.5rem',
          { lineHeight: '4rem', fontWeight: '900', letterSpacing: '-0.025em' },
        ],
        'display-xl': [
          '4.5rem',
          { lineHeight: '5rem', fontWeight: '900', letterSpacing: '-0.05em' },
        ],
        'display-2xl': [
          '5.5rem',
          { lineHeight: '6rem', fontWeight: '900', letterSpacing: '-0.05em' },
        ],
      },

      // Enhanced Industrial Grid System
      gridTemplateColumns: {
        'auto-fit-120': 'repeat(auto-fit, minmax(120px, 1fr))',
        'auto-fit-200': 'repeat(auto-fit, minmax(200px, 1fr))',
        'auto-fit-250': 'repeat(auto-fit, minmax(250px, 1fr))',
        'auto-fit-300': 'repeat(auto-fit, minmax(300px, 1fr))',
        'auto-fill-120': 'repeat(auto-fill, minmax(120px, 1fr))',
        'auto-fill-200': 'repeat(auto-fill, minmax(200px, 1fr))',
        'auto-fill-250': 'repeat(auto-fill, minmax(250px, 1fr))',
        'auto-fill-300': 'repeat(auto-fill, minmax(300px, 1fr))',
        dashboard: 'repeat(auto-fit, minmax(280px, 1fr))',
        cards: 'repeat(auto-fit, minmax(320px, 1fr))',
        table: 'repeat(auto-fit, minmax(150px, 1fr))',
      },

      // Industrial Container Queries
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          lg: '2rem',
          xl: '3rem',
          '2xl': '4rem',
        },
        screens: {
          xs: '475px',
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px',
          '3xl': '1920px',
        },
      },

      // Industrial Animation Timing
      transitionDuration: {
        '2000': '2000ms',
        '3000': '3000ms',
        '4000': '4000ms',
        '5000': '5000ms',
      },

      // Industrial Z-Index Scale
      zIndex: {
        dropdown: '1000',
        sticky: '1020',
        fixed: '1030',
        'modal-backdrop': '1040',
        modal: '1050',
        popover: '1060',
        tooltip: '1070',
        toast: '1080',
        'system-bar': '1090',
      },

      // Industrial Aspect Ratios
      aspectRatio: {
        'industrial-card': '4 / 3',
        'industrial-banner': '16 / 9',
        'industrial-square': '1 / 1',
        'industrial-portrait': '3 / 4',
        'industrial-landscape': '16 / 10',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),

    // Custom Industrial Plugin
    function ({ addUtilities, addComponents }: any) {
      // Industrial Pattern Utilities
      addUtilities({
        '.metal-grid': {
          backgroundImage: `linear-gradient(rgba(108, 117, 125, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(108, 117, 125, 0.1) 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        },
        '.brushed-steel': {
          background: `linear-gradient(90deg, 
                       rgba(108, 117, 125, 0.1) 0%, 
                       rgba(108, 117, 125, 0.05) 50%, 
                       rgba(108, 117, 125, 0.1) 100%)`,
        },
        '.industrial-gradient': {
          background: `linear-gradient(135deg, 
                       #2C3E50 0%, 
                       #34495E 25%, 
                       #1E3A8A 75%, 
                       #1E40AF 100%)`,
        },
        '.gear-spin': {
          animation: 'spin 8s linear infinite',
        },
        '.gear-reverse': {
          animation: 'spin 8s linear infinite reverse',
        },
        '.metal-shimmer': {
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '0',
            left: '-100%',
            width: '100%',
            height: '100%',
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            animation: 'shimmer 2s infinite',
          },
        },
        '.industrial-focus': {
          '&:focus-visible': {
            outline: '2px solid var(--industrial-accent)',
            outlineOffset: '2px',
            borderRadius: '0.25rem',
          },
        },
      });

      // Industrial Component Classes
      addComponents({
        '.industrial-card': {
          backgroundColor: 'white',
          border: '1px solid rgb(206, 212, 218)',
          borderRadius: '0.5rem',
          boxShadow:
            '0 4px 6px -1px rgba(44, 62, 80, 0.1), 0 2px 4px -1px rgba(44, 62, 80, 0.06)',
          padding: '1.5rem',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow:
              '0 10px 15px -3px rgba(44, 62, 80, 0.1), 0 4px 6px -2px rgba(44, 62, 80, 0.05)',
            transform: 'translateY(-1px)',
          },
        },
        '.industrial-button': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '0.25rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          padding: '0.5rem 1rem',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          border: 'none',
          '&:focus-visible': {
            outline: '2px solid var(--industrial-accent)',
            outlineOffset: '2px',
          },
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
          },
        },
        '.industrial-input': {
          display: 'flex',
          width: '100%',
          borderRadius: '0.25rem',
          border: '1px solid rgb(173, 181, 189)',
          backgroundColor: 'white',
          padding: '0.5rem 0.75rem',
          fontSize: '0.875rem',
          transition: 'all 0.2s ease',
          '&:focus': {
            outline: 'none',
            borderColor: 'rgb(30, 58, 138)',
            boxShadow: '0 0 0 3px rgba(30, 58, 138, 0.1)',
          },
          '&::placeholder': {
            color: 'rgb(107, 114, 126)',
          },
        },
      });

      // Industrial Animation Keyframes
      addUtilities({
        '@keyframes shimmer': {
          '0%': { left: '-100%' },
          '100%': { left: '100%' },
        },
        '@keyframes industrial-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        '@keyframes gear-rotate': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        '@keyframes metal-glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(253, 224, 71, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(253, 224, 71, 0.5)' },
        },
      });
    },
  ],
} satisfies Config;
