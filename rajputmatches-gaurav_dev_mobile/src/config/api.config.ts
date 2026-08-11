import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Platform-aware API configuration for iOS and Android
 * Handles automatic IP resolution for Android Emulators (10.0.2.2) vs iOS Simulators (localhost/127.0.0.1)
 * as well as production/custom LAN IP endpoints.
 */

const getBaseUrl = (): string => {
  // Check for environment override
  const envUrl = process.env.EXPO_PUBLIC_API_URL || process.env.REACT_APP_BASE_URL;
  if (envUrl) {
    return envUrl.endsWith('/api/v1') ? envUrl : `${envUrl.replace(/\/$/, '')}/api/v1`;
  }

  // Developer machine host detection from Expo dev server
  const manifest = Constants.expoConfig || (Constants as any).manifest;
  const devHost = (manifest as any)?.debuggerHost?.split(':').shift() || (manifest as any)?.hostUri?.split(':').shift();

  if (devHost && !__DEV__) {
    return `http://${devHost}:5000/api/v1`;
  }

  if (Platform.OS === 'android') {
    // Android Emulator host loopback address
    return 'http://10.0.2.2:5000/api/v1';
  } else if (Platform.OS === 'ios') {
    // iOS Simulator host loopback address
    return 'http://localhost:5000/api/v1';
  } else {
    // Web / fallback
    return 'http://localhost:5000/api/v1';
  }
};

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  TIMEOUT: 15000,
  TOKEN_STORAGE_KEY: 'rajputmatches_authToken',
  USER_STORAGE_KEY: 'rajputmatches_user',
};

export default API_CONFIG;
