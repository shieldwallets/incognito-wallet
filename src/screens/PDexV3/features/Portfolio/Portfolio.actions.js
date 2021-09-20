import { defaultAccountWalletSelector } from '@src/redux/selectors/account';
import { ExHandler } from '@src/services/exception';
import { getPDexV3Instance } from '@src/screens/PDexV3';
import {batch} from 'react-redux';
import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
  ACTION_SET_SHARE_DETAIL,
} from './Portfolio.constant';
import { portfolioSelector } from './Portfolio.selector';

export const actionFetching = () => ({
  type: ACTION_FETCHING,
});

export const actionFetched = (payload) => ({
  type: ACTION_FETCHED,
  payload,
});

export const actionFetchFail = () => ({
  type: ACTION_FETCH_FAIL,
});

export const actionSetShareDetail = (payload) => ({
  type: ACTION_SET_SHARE_DETAIL,
  payload,
});

export const actionFetch = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const { isFetching } = portfolioSelector(state);
    if (isFetching) {
      return;
    }
    await dispatch(actionFetching());
    const account = defaultAccountWalletSelector(state);
    const pDexV3Inst = await getPDexV3Instance({ account });
    let listShare = await pDexV3Inst.getListShare();
    const poolIds = (listShare || []).map(({ poolId }) => poolId);
    let poolDetails = [];
    if (poolIds.length > 0) {
      poolDetails = await pDexV3Inst.getListPoolsDetail(poolIds);
    }
    batch(() => {
      dispatch(actionSetShareDetail(poolDetails));
      dispatch(actionFetched(listShare));
    });
  } catch (error) {
    new ExHandler(error).showErrorToast();
    await dispatch(actionFetchFail());
  }
};
