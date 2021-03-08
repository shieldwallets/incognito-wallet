import { NativeModules } from 'react-native';

const PrivacyGo = NativeModules.PrivacyGo;
const requiredTimeMethods = [
  'createTransaction',
  'getSignPublicKey',
  'signPoolWithdraw',
  'createConvertTx',
  'newKeySetFromPrivate',
  'decryptCoin',
  'createCoin',
  'generateBLSKeyPairFromSeed',
  'hybridEncrypt',
  'hybridDecrypt',
];

const log = (...args) => null;

try {
  requiredTimeMethods.forEach(methodName => {
    global[methodName] = (data, time = 0) => {
      return new Promise(async (resolve, reject) => {
        try {
          log(`${methodName} called with params`, data);

          PrivacyGo[methodName](data, time, function(error, result) {
            if (error) {
              reject(error);
            }

            log(`${methodName} called successfully with result`, result);
            return resolve(result);
          });
        } catch (e) {
          log(`${methodName} called with error`, e);
          reject(e);
        }
      });
    };
  });
  console.log('GO modules were loaded');
} catch {
  console.error('GO modules can not loaded');
}

/**
 * Sign staking pool withdraw
 * @param {string} privateKey
 * @param {string} paymentAddress
 * @param {string | number} amount
 * @returns {Promise<string>} signatureEncode
 */
export const signPoolWithdraw = (privateKey, paymentAddress, amount) => {
  if (!privateKey) {
    throw new Error('Private key is missing');
  }

  if (!paymentAddress) {
    throw new Error('Payment address is missing');
  }

  if (!Number.isInteger(Number.parseInt(amount))) {
    throw new Error('Amount is invalid');
  }

  const args = {
    data: {
      privateKey,
      paymentAddress,
      amount: amount.toString(),
    }
  };

  return global.signPoolWithdraw(JSON.stringify(args));
};

/**
 * Get sign public key
 * @param {string} privateKey
 * @returns {Promise<string>} signPublicKeyEncode
 */
export const getSignPublicKey = (privateKey) => {
  if (!privateKey) {
    throw new Error('Private key is missing');
  }

  const args = {
    data: {
      privateKey,
    }
  };

  return global.getSignPublicKey(JSON.stringify(args));
};
