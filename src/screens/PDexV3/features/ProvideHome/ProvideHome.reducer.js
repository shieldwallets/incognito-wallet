import TYPES from '@screens/PDexV3/features/ProvideHome/ProvideHome.constant';

const initialState = {
  data: []
};

const provideHomeReducer = (state = initialState, action) => {
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
  case TYPES.ACTION_UPDATE_DATA: {
    return {
      ...state,
      data: action.payload
    };
  }
  default:
    return state;
  }
};

export default provideHomeReducer;
