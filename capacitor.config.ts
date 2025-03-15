
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.1ced3d0c5b464aa581e60b645c90d997',
  appName: 'love-islanders-haven',
  webDir: 'dist',
  server: {
    url: 'https://1ced3d0c-5b46-4aa5-81e6-0b645c90d997.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  // Enable hideable address bar in iOS
  ios: {
    contentInset: 'always',
  },
  // Enable keyboard resizing in Android
  android: {
    captureInput: true,
  }
};

export default config;
