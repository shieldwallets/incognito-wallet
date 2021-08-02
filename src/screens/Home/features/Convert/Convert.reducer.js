import { TYPES } from '@screens/Home/features/Convert/Convert.actionsName';

const initialClearState = {
  isFetching: true,
  isRefreshing: false,

  isConverting: false,
  isConverted: false,
  convertStep: undefined, // followed by tokenID

  messages: [], // tokenID, error message
  percents: {}, // tokenID, percent convert
  data: {
    unspentCoins: [],
    address: undefined
  },
};

const initialState = {
  ...initialClearState
};

const convertReducer = (state = initialState, action) => {
  switch (action.type) {
  case TYPES.ACTION_FETCH_COINS_V1: {
    const { data } = action.payload;
    return {
      ...state,
      data,
      isFetching: false,
      isRefreshing: false,
    };
  }
  case TYPES.ACTION_FETCHING_COINS_V1: {
    return {
      ...state,
      isFetching: action.payload,
    };
  }
  case TYPES.ACTION_CLEAR_CONVERT_DATA: {
    return {
      ...state,
      ...initialClearState,
      messages: [],
      percents: {}
    };
  }
  case TYPES.ACTION_REFRESHING_COINS_V1: {
    return {
      ...state,
      isRefreshing: action.payload,
    };
  }
  case TYPES.ACTION_CONVERTING: {
    return {
      ...state,
      isConverting: action.payload,
    };
  }
  case TYPES.ACTION_UPDATE_CURRENT_CONVERT_STEP: {
    return {
      ...state,
      convertStep: action.payload,
    };
  }
  case TYPES.ACTION_UPDATE_CONVERT_MESSAGE: {
    const messages = state.messages;
    messages.push(action.payload);
    return {
      ...state,
      messages
    };
  }
  case TYPES.ACTION_CONVERTED: {
    return {
      ...state,
      convertStep: undefined,
      isConverting: false,
      isConverted: true,
    };
  }
  case TYPES.ACTION_UPDATE_PERCENT_CONVERT: {
    const { tokenID, percent } = action.payload;
    const combinePercents = Object.assign(state?.percents, { [tokenID]: percent });
    return {
      ...state,
      percents: combinePercents
    };
  }
  default:
    return state;
  }
};

export default convertReducer;
