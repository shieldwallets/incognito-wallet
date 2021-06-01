import AsyncStorage from '@react-native-community/async-storage';

export const wcProviderOptionals = {
  bridge: 'https://walletconnect-bridge.incognito.org',
  clientMeta:{
    description: 'Connect with Incognito Wallet',
    url: 'https://incognito.org/',
    icons: ['https://walletconnect.org/walletconnect-logo.png'],
    name: 'IncognitoWallet'
  },
  redirectUrl: 'IncognitoWallet://',
  storageOptions:{
    asyncStorage: AsyncStorage,
  }
};