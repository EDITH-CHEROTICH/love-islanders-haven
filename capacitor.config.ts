
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // Unique app identifier for app stores
  appId: 'com.lovable.islandershaven',
  
  // Display name of your app
  appName: 'love-islanders-haven',
  
  // Build output directory
  webDir: 'dist',
  
  // Development server configuration for hot reload
  server: {
    url: 'https://1ced3d0c-5b46-4aa5-81e6-0b645c90d997.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  
  // iOS specific configuration
  ios: {
    contentInset: 'always', // Enables hideable address bar
  },
  
  // Android specific configuration
  android: {
    captureInput: true, // Enables proper keyboard resizing
    buildOptions: {
      keystorePath: undefined,    // You'll set this when creating your keystore
      keystorePassword: undefined, // You'll set this when creating your keystore
      keystoreAlias: undefined,    // You'll set this when creating your keystore
      keystoreAliasPassword: undefined // You'll set this when creating your keystore
    }
  }
};

export default config;
