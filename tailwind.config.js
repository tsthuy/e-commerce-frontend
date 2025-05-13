/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from 'tailwindcss-animate';

module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  prefix: '',
  theme: {
    container: {
      center: 'true',
      padding: '2rem'
    },
    extend: {
      fontFamily: {
        urbanist: ['Urbanist"', 'sans-serif'],
        'good-dog-new': ['GoodDogNew"', 'sans-serif']
      },
      colors: {
        custom: {
          green: {
            DEFAULT: 'hsl(var(--custom-green))',
            bg: {
              hover: 'hsl(var(--custom-green-bg-hover))'
            },
            secondary: {
              DEFAULT: 'hsl(var(--custom-green-secondary))'
            }
          },
          yellow: {
            DEFAULT: 'hsl(var(--custom-yellow))',
            bg: {
              hover: 'hsl(var(--custom-yellow-bg-hover))'
            },
            secondary: {
              DEFAULT: 'hsl(var(--custom-yellow-secondary))'
            }
          },
          primary: {
            bg: {
              hover: 'hsl(var(--custom-primary-bg-hover))'
            }
          },
          destructive: {
            bg: {
              hover: 'hsl(var(--custom-destructive-bg-hover))'
            },
            secondary: {
              DEFAULT: 'hsl(var(--custom-destructive-secondary))'
            }
          },
          background: {
            DEFAULT: 'hsl(var(--custom-background))'
          }
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      spacing: {
        header: 'var(--header)',
        footer: 'var(--footer)',
        'sidebar-desktop': 'var(--sidebar-desktop)',
        'sidebar-mobile': 'var(--sidebar-mobile)',
        'header-public': 'var(--header-public)',
        'footer-public': 'var(--footer-public)'
      },
      keyframes: {
        ripple: {
          '0%': {
            width: '0px',
            height: '0px',
            opacity: '0.5'
          },
          '100%': {
            width: '500px',
            height: '500px',
            opacity: '0'
          }
        },
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        }
      },
      animation: {
        ripple: 'ripple 1s linear forwards',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [tailwindcssAnimate]
};
