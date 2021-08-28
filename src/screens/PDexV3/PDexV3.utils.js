/* eslint-disable import/no-cycle */
import Server from '@src/services/wallet/Server';
import storage from '@src/services/storage';
import { PDexV3, Validator } from 'incognito-chain-web-js/build/wallet';
import BigNumber from 'bignumber.js';
import format from '@src/utils/format';
import convertUtil from '@utils/convert';
import {ceil, floor, isNaN, isNumber} from 'lodash';

export const getPDexV3Instance = async ({ account }) => {
  try {
    const server = await Server.getDefault();
    new Validator('getPDexV3Instance-account', account).required().object();
    let pDexV3Inst = new PDexV3();
    pDexV3Inst.setRPCTradeService(server.tradeServices);
    pDexV3Inst.setStorageServices(storage);
    pDexV3Inst.setAccount(account);
    return pDexV3Inst;
  } catch (error) {
    console.log('getPDexV3Instance-error', error);
  }
};

export const getPairRate = ({ token1, token2, token1Value, token2Value }) => {
  try {
    const rawRate = new BigNumber(token2Value).dividedBy(
      new BigNumber(token1Value),
    );
    let rawRateNumber = rawRate.toNumber();
    let rawRateFixed = format.toFixed(rawRateNumber, token2?.pDecimals);
    let rawRateStr = rawRate.toString();
    if (!rawRateFixed || rawRateFixed === '0') {
      return rawRateStr;
    }
    return rawRateFixed;
  } catch (error) {
    console.log('getPairRate-error', error);
  }
};

export const getExchangeRate = (token1, token2, token1Value, token2Value) => {
  try {
    const rawRate = getPairRate({ token1, token2, token1Value, token2Value });
    return `1 ${token1.symbol} = ${format.amountFull(rawRate, 0, false)} ${
      token2?.symbol
    }`;
  } catch (error) {
    console.log('getExchangeRate-error', error);
  }
};

export const getPrincipal = (token1, token2, token1Value, token2Value) => {
  const token1Str = `${format.amount(token1Value, token1.pDecimals)} ${
    token1.symbol
  }`;
  const token2Str = `${format.amount(token2Value, token2.pDecimals)} ${
    token2.symbol
  }`;
  return `${token1Str} + ${token2Str}`;
};

export const getShareStr = (share, totalShare) => {
  const percent = format.toFixed(
    new BigNumber(share)
      .dividedBy(totalShare || 1)
      .multipliedBy(100)
      .toString(),
    7,
  );
  return `${share} (${percent}%)`;
};

export const getReward = (token1, token2, token1Value, token2Value) => {
  const token1Str = `${format.amount(token1Value, token1.pDecimals)} ${
    token1.symbol
  }`;
  const token2Str = `${format.amount(token2Value, token2.pDecimals)} ${
    token2.symbol
  }`;
  return `${token1Str} + ${token2Str}`;
};

export const getPoolSize = (token1, token2, token1PoolValue, token2PoolValue) => {
  const formattedToken1Pool = format.amount(
    token1PoolValue,
    token1?.pDecimals,
    true,
  );
  const formattedToken2Pool = format.amount(
    token2PoolValue,
    token2?.pDecimals,
    true,
  );
  return `${formattedToken1Pool} ${token1?.symbol} + ${formattedToken2Pool} ${token2?.symbol}`;
};

export const parseInputWithText = ({ text, token }) => {
  let number = convertUtil.toNumber(text, true);
  number = convertUtil.toOriginalAmount(number, token.pDecimals, token.pDecimals !== 0);
  return number;
};

export const calculateContributeValue = ({ inputValue, outputToken, inputPool, outputPool, isInput }) => {
  if (!inputPool || !outputPool) return;
  if (!outputToken || !isNumber(inputValue) || isNaN(inputValue) || !inputValue) {
    return '';
  }
  const rate = format.toFixed(new BigNumber(outputPool).dividedBy(inputPool).toNumber(), outputToken.pDecimals);
  const number = new BigNumber(inputValue).multipliedBy(rate).toNumber();
  const outputValue = isInput ? floor(number) : ceil(number);
  const outputText = format.amountFull(outputValue, outputToken.pDecimals);
  return outputText;
};

export const formatBalance = (token1, token2, token1Value, token2Value) => {
  if (!token1 || !token2 || token1Value === undefined || token2Value === undefined) return '';
  const token1Str = `${format.amount(token1Value, token1.pDecimals)} ${
    token1.symbol
  }`;
  const token2Str = `${format.amount(token2Value, token2.pDecimals)} ${
    token2.symbol
  }`;
  return `${token1Str} + ${token2Str}`;
};
