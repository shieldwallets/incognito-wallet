import Erc20Token from '@src/models/erc20Token';
import PToken from '@src/models/pToken';
import BEP2Token from '@models/bep2Token';
import http from '@src/services/http';
import { CONSTANT_CONFIGS } from '@src/constants';
import axios from 'axios';
import { cachePromise } from '@services/cache';

let BEP2Tokens = [];

const getTokenListNoCache = () => {
  return http.get('ptoken/list')
    .then(res => {
      return res.map(token => new PToken(token));
    });
};

export const getTokenList = () => {
  return cachePromise('ptoken', getTokenListNoCache);
};

export const detectERC20Token = erc20Address => {
  if (!erc20Address) throw new Error('Missing erc20Address to detect');
  return http.post('eta/detect-erc20', {
    Address: erc20Address
  })
    .then(res => new Erc20Token(res));
};

export const detectBEP2Token = async (symbol) => {
  if (!symbol) throw new Error('Missing BEP2 symbol to detect');

  if (BEP2Token.length === 0) {
    const res = await axios.get(`${CONSTANT_CONFIGS.DEX_BINANCE_TOKEN_URL}?limit=1000000`);
    BEP2Tokens = res.data.map(item => new BEP2Token(item));
  }

  return BEP2Tokens.find(item => item.originalSymbol === symbol);
};
