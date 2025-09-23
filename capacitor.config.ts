import {CapacitorConfig} from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bierfreunde.pliny',
  appName: 'Pliny the Helper',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  "plugins": {
    EdgeToEdge: {
      backgroundColor: "#1f1f1f"
    }
  }
};

export default config;
