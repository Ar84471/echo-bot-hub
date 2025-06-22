
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.5b530e81df204010a2fee45018bec135',
  appName: 'NeuralForge',
  webDir: 'dist',
  server: {
    url: 'https://5b530e81-df20-4010-a2fe-e45018bec135.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#000000',
      showSpinner: false
    }
  }
};

export default config;
