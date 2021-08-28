import TYPES from '@screens/PDexV3/features/RemovePool/RemovePool.constant';
import {ACCOUNT_CONSTANT} from 'incognito-chain-web-js/build/wallet';

const initialState = {
  poolId: '111',
  isFetching: false,
  isFetched: false,
  inputToken: undefined,
  outputToken: undefined,
  feeAmount: ACCOUNT_CONSTANT.MAX_FEE_PER_TX,
};

const contributeReducer = (state = initialState, action) => {
  switch (action.type) {
  case TYPES.ACTION_FETCHING: {
    return {
      ...state,
      isFetching: true,
      isFetched: false
    };
  }
  case TYPES.ACTION_FETCHED: {
    return {
      ...state,
      isFetching: false,
      isFetched: true
    };
  }
  case TYPES.ACTION_FETCH_FAIL: {
    return {
      ...state,
      isFetching: false,
      isFetched: false
    };
  }
  case TYPES.ACTION_SET_TOKEN_ID: {
    const { inputTokenID, outputTokenID } = action.payload;
    return {
      ...state,
      inputToken: inputTokenID,
      outputToken: outputTokenID
    };
  }
  default:
    return state;
  }
};

export default contributeReducer;
