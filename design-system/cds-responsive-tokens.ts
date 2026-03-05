/**
 * CDS Responsive Design Tokens
 * Responsive typography, sizing, and spacing tokens that adapt across breakpoints
 */

import { breakpointTokens } from './tokens';

/**
 * Responsive Typography Tokens
 * Font sizes that scale across breakpoints for better readability
 */
export const responsiveTypography = {
  // Headings - scale down on mobile
  h1: {
    xs: '2.5rem',    // 40px mobile
    sm: '3.5rem',    // 56px tablet
    md: '4.5rem',    // 72px desktop
    lg: '6rem',      // 96px large
  },
  h2: {
    xs: '2rem',      // 32px mobile
    sm: '2.75rem',   // 44px tablet
    md: '3.25rem',   // 52px desktop
    lg: '3.75rem',   // 60px large
  },
  h3: {
    xs: '1.75rem',   // 28px mobile
    sm: '2.25rem',   // 36px tablet
    md: '2.75rem',   // 44px desktop
    lg: '3rem',      // 48px large
  },
  h4: {
    xs: '1.5rem',    // 24px mobile
    sm: '1.75rem',   // 28px tablet
    md: '2rem',      // 32px desktop
    lg: '2.125rem',  // 34px large
  },
  h5: {
    xs: '1.25rem',   // 20px mobile
    sm: '1.375rem',  // 22px tablet
    md: '1.5rem',    // 24px desktop
  },
  h6: {
    xs: '1.125rem',  // 18px mobile
    sm: '1.25rem',   // 20px tablet and up
  },

  // Body text - slight adjustment on mobile for readability
  body1: {
    xs: '0.9375rem', // 15px mobile (slightly smaller)
    sm: '1rem',      // 16px tablet and up
  },
  body2: {
    xs: '0.8125rem', // 13px mobile
    sm: '0.875rem',  // 14px tablet and up
  },

  // Button text
  button: {
    xs: '0.8125rem', // 13px mobile
    sm: '0.875rem',  // 14px tablet and up
  },

  // Caption and small text
  caption: {
    xs: '0.6875rem', // 11px mobile
    sm: '0.75rem',   // 12px tablet and up
  },
} as const;

/**
 * Responsive Spacing Tokens
 * Spacing values that increase at larger breakpoints
 */
export const responsiveSpacing = {
  // Container padding
  containerPadding: {
    xs: 2,  // 8px mobile
    sm: 3,  // 12px tablet
    md: 4,  // 16px desktop
    lg: 6,  // 24px large
  },

  // Section spacing
  sectionSpacing: {
    xs: 3,  // 12px mobile
    sm: 4,  // 16px tablet
    md: 6,  // 24px desktop
    lg: 8,  // 32px large
  },

  // Card/Paper padding
  cardPadding: {
    xs: 2,  // 8px mobile
    sm: 2,  // 8px tablet
    md: 3,  // 12px desktop
    lg: 4,  // 16px large
  },

  // List item padding
  listItemPadding: {
    xs: 1.5, // 6px mobile
    sm: 2,   // 8px tablet and up
  },

  // Button padding (horizontal)
  buttonPaddingX: {
    xs: 3,  // 12px mobile
    sm: 4,  // 16px tablet and up
  },
} as const;

/**
 * Responsive Sizing Tokens
 * Component sizes that adapt to screen size
 */
export const responsiveSizing = {
  // Button heights
  button: {
    small: {
      xs: 30,  // 30px mobile
      sm: 32,  // 32px tablet and up
    },
    medium: {
      xs: 38,  // 38px mobile
      sm: 40,  // 40px tablet and up
    },
    large: {
      xs: 44,  // 44px mobile
      sm: 48,  // 48px tablet and up
    },
  },

  // TextField heights
  input: {
    xs: 40,  // 40px mobile (still accessible)
    sm: 44,  // 44px tablet
    md: 48,  // 48px desktop
  },

  // AppBar heights
  appBar: {
    xs: 56,  // 56px mobile
    sm: 60,  // 60px tablet
    md: 64,  // 64px desktop
  },

  // Avatar sizes
  avatar: {
    small: {
      xs: 24,  // 24px all screens
    },
    medium: {
      xs: 32,  // 32px mobile
      sm: 40,  // 40px tablet and up
    },
    large: {
      xs: 48,  // 48px mobile
      sm: 56,  // 56px tablet and up
    },
  },

  // Icon sizes
  icon: {
    small: {
      xs: 18,  // 18px mobile
      sm: 20,  // 20px tablet and up
    },
    medium: {
      xs: 22,  // 22px mobile
      sm: 24,  // 24px tablet and up
    },
    large: {
      xs: 28,  // 28px mobile
      sm: 32,  // 32px tablet and up
    },
  },

  // Chip height
  chip: {
    xs: 28,  // 28px mobile
    sm: 32,  // 32px tablet and up
  },

  // Touch targets (always meet WCAG)
  touchTarget: {
    min: 48,  // Always 48px minimum
  },
} as const;

/**
 * Responsive Border Radius
 * Border radius that scales slightly at larger screens
 */
export const responsiveBorderRadius = {
  small: {
    xs: 3,   // 3px mobile
    sm: 4,   // 4px tablet and up
  },
  medium: {
    xs: 6,   // 6px mobile
    sm: 8,   // 8px tablet and up
  },
  large: {
    xs: 10,  // 10px mobile
    sm: 12,  // 12px tablet and up
  },
} as const;

/**
 * Helper function to create responsive style object
 */
export const createResponsiveStyles = (property: string, values: Record<string, any>) => {
  const breakpoints = Object.keys(breakpointTokens.values) as Array<keyof typeof breakpointTokens.values>;
  const styles: Record<string, any> = {};

  breakpoints.forEach((breakpoint) => {
    if (values[breakpoint] !== undefined) {
      if (breakpoint === 'xs') {
        styles[property] = values[breakpoint];
      } else {
        if (!styles[`@media (min-width:${breakpointTokens.values[breakpoint]}px)`]) {
          styles[`@media (min-width:${breakpointTokens.values[breakpoint]}px)`] = {};
        }
        styles[`@media (min-width:${breakpointTokens.values[breakpoint]}px)`][property] = values[breakpoint];
      }
    }
  });

  return styles;
};

/**
 * Typography responsive helper
 * Creates responsive fontSize styles
 */
export const responsiveFontSize = (sizes: Record<string, string>) => {
  return createResponsiveStyles('fontSize', sizes);
};

/**
 * Spacing responsive helper
 * Creates responsive spacing styles (with theme.spacing multiplier)
 */
export const responsiveSpacingHelper = (property: string, values: Record<string, number>) => {
  // This returns the values structure that should be used with theme.spacing()
  return values;
};
