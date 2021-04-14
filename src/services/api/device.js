import http2 from '@src/services/http2';
import http3 from '@src/services/http3';
import { cachePromise, KEYS } from '@services/cache';

const getPDEStateNoCache = () => {
  return http2.post('/chain', {
    'jsonrpc': '1.0',
    'method': 'getpdestate',
    'params': [],
    'id': 1
  });
};

/**
 * Get pde state
 * @returns {AxiosPromise<Object>}
 */
export const getPDEState = () => {
  return cachePromise(KEYS.PDESTATE, getPDEStateNoCache);
};

/**
 * Convert prv fee to token fee
 * @param {Number} prvAmount
 * @param {string} tokenId
 * @returns {AxiosPromise<Number>} tokenFee
 */
export const convertPRVFeeToTokenFee = ({ prvAmount, tokenId }) => {
  return http2.get('/chain/estimateFee', {
    'Prv': prvAmount,
    'TokenID': tokenId
  });
};

/**
 * Convert prv fee to token fee
 * @param {object} device
 */
export const getPNodeBackLog = async (device) => {
  if(!device || !device.QRCode) return null;
  return http3.get(`/device?qrcode=${device.QRCode}`).then((data) => {
    return {
      ...data,
      description: data?.description ? JSON.parse(data.description) : {}
    };
  });
};
