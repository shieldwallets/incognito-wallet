import { activedTabSelector } from '@src/components/core/Tabs/Tabs.selector';
import { ExHandler } from '@src/services/exception';
import { actionFetch as actionFetchListShare } from '@screens/PDexV3/features/Portfolio';
import {
  actionFetchTradingVolume24h,
  actionFetchListPools,
} from '@screens/PDexV3/features/Pools';
import {
  TAB_POOLS_ID,
  TAB_PORTFOLIO_ID,
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
  ACTION_FREE_HOME_PDEX_V3,
  ROOT_TAB_HOME,
} from './Home.constant';
import { homePDexV3Selector } from './Home.selector';

export const actionFetching = () => ({
  type: ACTION_FETCHING,
});

export const actionFetched = () => ({
  type: ACTION_FETCHED,
});

export const actionFetchFail = () => ({
  type: ACTION_FETCH_FAIL,
});

export const actionFreeHomePDexV3 = () => ({
  type: ACTION_FREE_HOME_PDEX_V3,
});

export const actionRefresh = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const { isFetching } = homePDexV3Selector(state);
    if (isFetching) {
      return;
    }
    await dispatch(actionFetching());
    const activedTab = activedTabSelector(state)(ROOT_TAB_HOME);
    let task = [];
    switch (activedTab) {
    case TAB_POOLS_ID: {
      task = [
        dispatch(actionFetchTradingVolume24h()),
        dispatch(actionFetchListPools()),
        dispatch(actionFetchListShare()),
      ];
      break;
    }
    case TAB_PORTFOLIO_ID: {
      task = [dispatch(actionFetchListShare())];
      break;
    }
    default:
      task = [
        dispatch(actionFetchTradingVolume24h()),
        dispatch(actionFetchListPools()),
        dispatch(actionFetchListShare()),
      ];
      break;
    }
    await Promise.all(task);
  } catch (error) {
    new ExHandler(error).showErrorToast();
  } finally {
    dispatch(actionFetched());
  }
};
