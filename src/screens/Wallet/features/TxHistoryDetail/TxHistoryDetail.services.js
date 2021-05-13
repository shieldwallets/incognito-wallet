import http from '@services/http';

export const apiRefreshHistory = async ({ txID, currencyType, signPublicKeyEncode, decentralized, isShieldAddressDecentralized }) => {
  return new Promise((resolve, reject) => {
    return http
      .post('eta/history/detail', {
        ID: txID,
        Decentralized: Number(decentralized),
        CurrencyType: currencyType,
        SignPublicKeyEncode: signPublicKeyEncode,
        NewShieldDecentralized: isShieldAddressDecentralized || 0
      })
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
