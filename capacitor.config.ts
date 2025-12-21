import {CapacitorConfig} from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bierfreunde.pliny',
  appName: 'Pliny the Helper',
  webDir: 'www/browser',
  server: {
    androidScheme: 'https'
  }
};

export default config;
