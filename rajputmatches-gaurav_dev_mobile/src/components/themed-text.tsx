import { Platform, StyleSheet, Text, type TextProps } from 'react-native';
import { Fonts, ThemeColor } from '../constants/theme';
import { useTheme } from '../hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'linkPrimary' | 'code' | 'royalHeading';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        { color: theme[themeColor ?? 'text'] },
        type === 'default' && styles.default,
        type === 'title' && styles.title,
        type === 'small' && styles.small,
        type === 'smallBold' && styles.smallBold,
        type === 'subtitle' && styles.subtitle,
        type === 'link' && styles.link,
        type === 'linkPrimary' && styles.linkPrimary,
        type === 'code' && styles.code,
        type === 'royalHeading' && styles.royalHeading,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  small: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  smallBold: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
  },
  default: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  title: {
    fontFamily: Fonts.heading,
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 40,
    letterSpacing: 0.6,
  },
  subtitle: {
    fontFamily: Fonts.heading,
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  royalHeading: {
    fontFamily: Fonts.serif,
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 26,
    letterSpacing: 0.8,
  },
  link: {
    fontFamily: Fonts.sans,
    lineHeight: 24,
    fontSize: 14,
    fontWeight: '600',
  },
  linkPrimary: {
    fontFamily: Fonts.sans,
    lineHeight: 24,
    fontSize: 14,
    fontWeight: '700',
    color: '#D4AF37',
  },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: '700' }) ?? '500',
    fontSize: 12,
  },
});
