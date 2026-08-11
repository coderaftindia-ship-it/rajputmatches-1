import React, { useState } from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';
import { API_CONFIG } from '../config/api.config';

const DEFAULT_MALE = require('../../assets/images/default_male.jpg');
const DEFAULT_FEMALE = require('../../assets/images/default_female.jpg');

interface SafeAvatarImageProps {
  uri?: string | null;
  gender?: string | null;
  name?: string;
  style?: StyleProp<ImageStyle>;
}

const getHostUrl = (): string => {
  return API_CONFIG.BASE_URL.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');
};

export const resolveImageUrl = (uri?: string | null): string | null => {
  if (!uri || typeof uri !== 'string') return null;
  const trimmed = uri.trim();
  if (!trimmed) return null;

  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:')
  ) {
    return trimmed;
  }

  const host = getHostUrl();
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${host}${path}`;
};

/**
 * SafeAvatarImage Component:
 * 1. If user HAS a valid profile picture (uri), it resolves the URL and shows their actual photo.
 * 2. If user DOES NOT have a picture (or photo link is broken/fails to load), it automatically
 *    falls back to:
 *    - Female Royal Rajput Avatar (if gender is Female)
 *    - Male Royal Rajput Avatar (if gender is Male or default)
 */
export const SafeAvatarImage: React.FC<SafeAvatarImageProps> = ({
  uri,
  gender,
  name,
  style,
}) => {
  const [error, setError] = useState(false);
  const [prevUri, setPrevUri] = useState<string | null | undefined>(uri);

  if (prevUri !== uri) {
    setPrevUri(uri);
    setError(false);
  }

  const resolvedUri = resolveImageUrl(uri);

  const getFallbackSource = () => {
    const normalizedGender = (gender || '').toString().trim().toLowerCase();
    if (normalizedGender === 'female' || normalizedGender === 'f') {
      return DEFAULT_FEMALE;
    }
    if (normalizedGender === 'male' || normalizedGender === 'm') {
      return DEFAULT_MALE;
    }
    // Infer from name if gender not specified
    const lowerName = (name || '').toLowerCase();
    if (
      lowerName.includes('kanwar') ||
      lowerName.includes('kumari') ||
      lowerName.includes('baisa') ||
      lowerName.includes('devi') ||
      lowerName.endsWith('a')
    ) {
      return DEFAULT_FEMALE;
    }
    return DEFAULT_MALE;
  };

  // If user has NO picture OR image failed to load, show default royal picture
  if (error || !resolvedUri) {
    return (
      <Image
        source={getFallbackSource()}
        style={style}
        resizeMode="cover"
      />
    );
  }

  // Show user's actual uploaded picture
  return (
    <Image
      source={{ uri: resolvedUri }}
      style={style}
      resizeMode="cover"
      onError={() => setError(true)}
    />
  );
};

export default SafeAvatarImage;
