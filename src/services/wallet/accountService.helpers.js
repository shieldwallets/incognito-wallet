import { AsyncStorage } from 'react-native';
import { saveAccountCached } from '@src/database/helper/accountCached.helpers';

export const setIsMirage = async (isMirageKey) => {
  await AsyncStorage.setItem(isMirageKey, JSON.stringify(true));
};

export const getIsMirage = async (isMirageKey) => {
  if(!isMirageKey) return false;
  return JSON.parse(await AsyncStorage.getItem(isMirageKey));
};

export const handleCachedAccount = async (account, key) => {
  const cached = {
    serials: account?.derivatorToSerialNumberCache || {},
    spentCoin: account?.spentCoinCached || {}
  };
  const start = new Date().getTime();
  await saveAccountCached(key, cached);
  const end = new Date().getTime();
  console.log(`Save account in: ${end - start}Ms`);
  await setIsMirage(key);
};