import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nizeorg.app',
  appName: 'NizeOrg',
  webDir: 'www',
  plugins: {
    FirebaseAuthentication: {
      providers: ['phone'],
      skipNativeAuth: false,
    },
  },
};

export default config;
