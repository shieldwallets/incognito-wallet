import TYPES from '@screens/PDexV3/features/ProvideHome/ProvideHome.constant';
import {defaultAccountSelector} from '@src/redux/selectors/account';
import {getPDexV3Instance} from '@screens/PDexV3';
import {ExHandler} from '@services/exception';
import {statusProvideSelector} from '@screens/PDexV3/features/ProvideHome';
import isEmpty from 'lodash/isEmpty';
import {getBalance} from '@src/redux/actions/token';
import {PRVIDSTR} from 'incognito-chain-web-js/build/wallet';
import {batch} from 'react-redux';

const actionFetching = () => ({
  type: TYPES.ACTION_FETCHING,
});

const actionFetched = () => ({
  type: TYPES.ACTION_FETCHED,
});

const actionFetchFail = () => ({
  type: TYPES.ACTION_FETCH_FAIL,
});

const actionUpdateData = (payload) => ({
  type: TYPES.ACTION_UPDATE_DATA,
  payload,
});

const actionGetBalances = (tokenIDs) => async (dispatch) => {
  try {
    if (!tokenIDs.includes(PRVIDSTR)) {
      tokenIDs.push(PRVIDSTR);
    }
    tokenIDs.forEach(({ tokenId }) => {
      dispatch(getBalance(tokenId));
    });
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};

const actionFetch = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const { isLoading } = statusProvideSelector(state);
    if (isLoading) return;
    dispatch(actionFetching());
    const account = defaultAccountSelector(state);
    const pDexV3Inst = await getPDexV3Instance({ account });
    const data = (await pDexV3Inst.getProvideData()) || [];
    const tokenIDs = (data || []).map(({ tokenId }) => tokenId);
    batch(() => {
      dispatch(actionGetBalances(tokenIDs));
      dispatch(actionUpdateData(data));
    });
  } catch (error) {
    dispatch(actionFetchFail());
    new ExHandler(error).showErrorToast();
  } finally {
    dispatch(actionFetched());
  }
};

export default ({
  actionFetch,
});
