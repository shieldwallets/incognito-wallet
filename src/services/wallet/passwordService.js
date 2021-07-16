import { CONSTANT_CONFIGS, CONSTANT_KEYS } from '@src/constants';
import storage from '@src/services/storage';
import { getItemAsync, setItemAsync } from 'expo-secure-store';
import { byteToHexString } from 'incognito-chain-web-js/build/wallet';
import { misc, codec } from 'incognito-chain-web-js/lib/privacy/sjcl';
import { randomBytes } from 'react-native-randombytes';

const PASSWORD_DURATION_IN_MS = 7 * 24 * 3600 * 1000; // 7 days

export function clearPassword() {
  storage.removeItem(CONSTANT_KEYS.PASSPHRASE_KEY);
}

export async function getPassphrase() {
  // TODO : password expiry
  let password = CONSTANT_CONFIGS.PASSPHRASE_WALLET_DEFAULT;
  const ACCESS_KEY = CONSTANT_KEYS.SALT_KEY || 'default-wallet-salt';
  try {
    let salt = await getItemAsync(ACCESS_KEY);
    if (!salt) {
      // generate a new wallet encryption key
      const raw = randomBytes(16);
      salt = byteToHexString(raw);
      await setItemAsync(ACCESS_KEY, salt);
    }
    console.log('PASSWORD-SERVICE : Load wallet salt', salt);

    let aesKey = misc.pbkdf2(password, salt, null, 128);
    aesKey = codec.hex.fromBits(aesKey);
    return {
      password,
      aesKey,
    };
  } catch (e) {
    console.log('error accessing SecureStorage', e);
    throw e;
  }
}
