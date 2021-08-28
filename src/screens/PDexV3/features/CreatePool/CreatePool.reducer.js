import TYPES from '@screens/PDexV3/features/CreatePool/CreatePool.constant';
import {ACCOUNT_CONSTANT} from 'incognito-chain-web-js/build/wallet';

const initialState = {
  inputToken: undefined,
  outputToken: undefined,
  feeAmount: ACCOUNT_CONSTANT.MAX_FEE_PER_TX,
};

const createPoolReducer = (state = initialState, action) => {
  switch (action.type) {
  case TYPES.ACTION_UPDATE_CREATE_POOL_VALUE: {
    return {
      ...state,
      ...action?.payload,
    };
  }
  case TYPES.ACTION_SET_INPUT_TOKEN_IDSTR: {
    return {
      ...state,
      inputToken: action?.payload,
    };
  }
  case TYPES.ACTION_SET_OUTPUT_TOKEN_IDSTR: {
    return {
      ...state,
      outputToken: action?.payload,
    };
  }
  default:
    return state;
  }
};

export default createPoolReducer;
