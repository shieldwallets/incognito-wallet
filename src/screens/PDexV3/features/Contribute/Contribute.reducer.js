import TYPES from '@screens/PDexV3/features/Contribute/Contribute.constant';
import {ACCOUNT_CONSTANT} from 'incognito-chain-web-js/build/wallet';

const initialState = {
  isFetching: false,
  isFetched: false,
  poolId: '',
  poolDetail: undefined,
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
  case TYPES.ACTION_UPDATE_POOL_ID: {
    return {
      ...state,
      poolId: action.payload,
    };
  }
  case TYPES.ACTION_UPDATE_POOL_DETAIL: {
    return {
      ...state,
      poolDetail: action.payload,
    };
  }
  case TYPES.ACTION_FREE_CONTRIBUTE: {
    return {
      ...state,
      ...initialState,
    };
  }
  case TYPES.ACTION_SET_TOKEN_ID: {
    return {
      ...state,
      ...action.payload,
    };
  }
  default:
    return state;
  }
};

export default contributeReducer;
