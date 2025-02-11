import { theme } from './theme';

export const components = {
  button: {
    base: `
      inline-flex items-center justify-center
      px-4 py-2
      font-medium
      rounded-lg
      transition-all
      focus:outline-none focus:ring-2 focus:ring-offset-2
    `,
    variants: {
      primary: `
        bg-[${theme.colors.primary.DEFAULT}]
        text-white
        hover:bg-[${theme.colors.primary.hover}]
        focus:ring-[${theme.colors.primary.DEFAULT}]
      `,
      secondary: `
        bg-[${theme.colors.secondary.DEFAULT}]
        text-white
        hover:bg-[${theme.colors.secondary.hover}]
        focus:ring-[${theme.colors.secondary.DEFAULT}]
      `,
      accent: `
        bg-[${theme.colors.accent.DEFAULT}]
        text-white
        hover:bg-[${theme.colors.accent.hover}]
        focus:ring-[${theme.colors.accent.DEFAULT}]
      `,
      outline: `
        border-2
        border-[${theme.colors.primary.DEFAULT}]
        text-[${theme.colors.primary.DEFAULT}]
        hover:bg-[${theme.colors.primary.bg}]
        focus:ring-[${theme.colors.primary.DEFAULT}]
      `,
      ghost: `
        text-[${theme.colors.primary.DEFAULT}]
        hover:bg-[${theme.colors.primary.bg}]
        focus:ring-[${theme.colors.primary.DEFAULT}]
      `,
    },
    sizes: {
      sm: 'text-sm px-3 py-1.5',
      md: 'text-base px-4 py-2',
      lg: 'text-lg px-6 py-3',
    },
  },
  card: {
    base: `
      rounded-xl
      overflow-hidden
      transition-all
    `,
    variants: {
      elevated: `
        bg-white dark:bg-[${theme.colors.dark.bg.secondary}]
        shadow-md
        hover:shadow-lg
      `,
      outlined: `
        border
        border-[${theme.colors.light.border}]
        dark:border-[${theme.colors.dark.border}]
      `,
      flat: `
        bg-[${theme.colors.light.bg.secondary}]
        dark:bg-[${theme.colors.dark.bg.secondary}]
      `,
    },
  },
  input: {
    base: `
      w-full
      px-4 py-2
      rounded-lg
      border
      transition-all
      focus:outline-none focus:ring-2
      disabled:opacity-50 disabled:cursor-not-allowed
    `,
    variants: {
      default: `
        border-[${theme.colors.light.border}]
        dark:border-[${theme.colors.dark.border}]
        bg-white dark:bg-[${theme.colors.dark.bg.secondary}]
        focus:border-[${theme.colors.primary.DEFAULT}]
        focus:ring-[${theme.colors.primary.DEFAULT}]
      `,
      error: `
        border-[${theme.colors.error.DEFAULT}]
        focus:border-[${theme.colors.error.DEFAULT}]
        focus:ring-[${theme.colors.error.DEFAULT}]
      `,
    },
  },
  badge: {
    base: `
      inline-flex items-center
      px-2.5 py-0.5
      rounded-full
      text-xs font-medium
    `,
    variants: {
      primary: `
        bg-[${theme.colors.primary.bg}]
        text-[${theme.colors.primary.DEFAULT}]
      `,
      secondary: `
        bg-[${theme.colors.secondary.bg}]
        text-[${theme.colors.secondary.DEFAULT}]
      `,
      accent: `
        bg-[${theme.colors.accent.bg}]
        text-[${theme.colors.accent.DEFAULT}]
      `,
      success: `
        bg-[${theme.colors.success.bg}]
        text-[${theme.colors.success.DEFAULT}]
      `,
      warning: `
        bg-[${theme.colors.warning.bg}]
        text-[${theme.colors.warning.DEFAULT}]
      `,
      error: `
        bg-[${theme.colors.error.bg}]
        text-[${theme.colors.error.DEFAULT}]
      `,
    },
  },
  heading: {
    base: `
      font-accent
      font-bold
      text-[${theme.colors.light.text.primary}]
      dark:text-[${theme.colors.dark.text.primary}]
    `,
    sizes: {
      h1: 'text-4xl md:text-5xl',
      h2: 'text-3xl md:text-4xl',
      h3: 'text-2xl md:text-3xl',
      h4: 'text-xl md:text-2xl',
      h5: 'text-lg md:text-xl',
      h6: 'text-base md:text-lg',
    },
  },
  text: {
    base: `
      font-primary
      text-[${theme.colors.light.text.primary}]
      dark:text-[${theme.colors.dark.text.primary}]
    `,
    variants: {
      secondary: `
        text-[${theme.colors.light.text.secondary}]
        dark:text-[${theme.colors.dark.text.secondary}]
      `,
      tertiary: `
        text-[${theme.colors.light.text.tertiary}]
        dark:text-[${theme.colors.dark.text.tertiary}]
      `,
    },
  },
} as const;

export type Components = typeof components;
export default components;
