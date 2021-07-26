import {
  Validator,
} from 'incognito-chain-web-js/build/wallet';
import { HEADER_TABS, INPUT_FIELDS } from '@screens/Dex/Liquidity.constants';
import convertUtil from '@utils/convert';

export const mergeInput = ({ tabName, addPool, removePool, withDraw }) => {
  new Validator('tabName', tabName).required().string();
  new Validator('addPool', addPool).required().object();
  new Validator('removePool', removePool).required().object();
  new Validator('withDraw', withDraw).required().object();
  switch (tabName) {
  case HEADER_TABS.Add: {
    return {
      ...addPool,
      name: INPUT_FIELDS.ADD_POOL
    };
  }
  case HEADER_TABS.Remove: {
    return {
      ...removePool,
      name: INPUT_FIELDS.REMOVE_POOL
    };
  }
  default:
    return {
      ...withDraw,
      name: INPUT_FIELDS.WITHDRAW
    };
  }
};

export const parseInputWithText = ({ text, token  }) => {
  let number = convertUtil.toNumber(text, true);
  number = convertUtil.toOriginalAmount(number, token.pDecimals, token.pDecimals !== 0);
  return number;
};
