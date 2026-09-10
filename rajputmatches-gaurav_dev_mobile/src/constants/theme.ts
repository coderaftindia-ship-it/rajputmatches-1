/**
 * Rajput Matches Theme & Typography System
 * Premium colors and cross-platform font family declarations for iOS, Android, and Web.
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
    primary: '#4A1235', // Deep Royal Maroon
    primaryDark: '#350B25',
    primaryLight: '#6B1B4D',
    gold: '#D4AF37', // Royal Gold
    goldDark: '#CD9024',
    goldLight: '#F4E4BC',
    white: '#FFFFFF',
    border: 'rgba(212, 175, 55, 0.35)',
  },
  dark: {
    text: '#FCF5EA', // Cream text on dark
    background: '#1A1A1A', // Dark background
    backgroundElement: '#2b2226', // Deep maroon dark
    backgroundSelected: '#D4AF37', // Gold for selection
    textSecondary: '#BFAFB5', // Light grey maroon
    primary: '#D4AF37', // Gold
    primaryDark: '#CD9024',
    primaryLight: '#F4E4BC',
    gold: '#D4AF37',
    goldDark: '#CD9024',
    goldLight: '#F4E4BC',
    white: '#FFFFFF',
    border: 'rgba(212, 175, 55, 0.2)',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    serif: 'Georgia',
    heading: 'Georgia',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  android: {
    sans: 'sans-serif-medium',
    serif: 'serif',
    heading: 'serif',
    rounded: 'sans-serif',
    mono: 'monospace',
  },
  default: {
    sans: 'sans-serif-medium',
    serif: 'serif',
    heading: 'serif',
    rounded: 'sans-serif',
    mono: 'monospace',
  },
  web: {
    sans: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    serif: "'Cinzel', 'Playfair Display', 'Georgia', 'Garamond', 'Times New Roman', serif",
    heading: "'Cinzel', 'Playfair Display', 'Georgia', serif",
    rounded: "'Plus Jakarta Sans', 'Outfit', sans-serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
}) as {
  sans: string;
  serif: string;
  heading: string;
  rounded: string;
  mono: string;
};

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
