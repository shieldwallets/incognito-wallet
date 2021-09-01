import TYPES from '@screens/PDexV3/features/ProvideMore/ProvideMore.constant';
import {ACCOUNT_CONSTANT, PRVIDSTR} from 'incognito-chain-web-js/build/wallet';

const initialState = {
  coin: undefined,
  feeTokenId: PRVIDSTR,
  feeAmount: ACCOUNT_CONSTANT.MAX_FEE_PER_TX,
  inputValue: 0,
  inputText: ''
};

const provideMoreReducer = (state = initialState, action) => {
  switch (action.type) {
  case TYPES.ACTION_SET_COIN: {
    return {
      ...state,
      coin: action.payload
    };
  }
  default:
    return state;
  }
};

export default provideMoreReducer;
