import {persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import { ACTION_UPDATE_CONNECTOR } from '@screens/Wallet/features/BridgeConnect/BridgeConnect.actionsName';

const initialState = {
  connector: {}
};

const bridgeConnectReducer = (state = initialState, action) => {
  switch (action.type) {
  case ACTION_UPDATE_CONNECTOR: {
    const { connector } = action;
    return {
      ...state,
      connector
    };
  }
  default:
    return state;
  }
};

const persistConfig = {
  key: 'bridgeConnect',
  storage: AsyncStorage,
  whitelist: [''],
  stateReconciler: autoMergeLevel2,
};

export default persistReducer(persistConfig, bridgeConnectReducer);