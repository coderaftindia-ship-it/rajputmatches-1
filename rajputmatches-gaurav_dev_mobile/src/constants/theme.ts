/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '../global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#3D232C', // Royal text
    background: '#FCF5EA', // Royal cream background
    backgroundElement: '#F0E5D3', // Royal cream-dark for elements
    backgroundSelected: '#EDB139', // Royal gold for selected state
    textSecondary: '#7A5C66', // Royal text light
    primary: '#59123B', // Royal maroon
    primaryDark: '#3f0c2a',
    primaryLight: '#821A56',
    gold: '#EDB139',
    goldDark: '#CD9024',
    goldLight: '#F5C870',
    white: '#FFFFFF',
    border: 'rgba(212, 175, 55, 0.35)',
  },
  dark: {
    text: '#FCF5EA', // Cream text on dark
    background: '#1A1A1A', // Dark background
    backgroundElement: '#2b2226', // Deep maroon dark
    backgroundSelected: '#EDB139', // Gold for selection
    textSecondary: '#BFAFB5', // Light grey maroon
    primary: '#EDB139', // Gold
    primaryDark: '#CD9024',
    primaryLight: '#F5C870',
    gold: '#EDB139',
    goldDark: '#CD9024',
    goldLight: '#F5C870',
    white: '#FFFFFF',
    border: 'rgba(212, 175, 55, 0.2)',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
