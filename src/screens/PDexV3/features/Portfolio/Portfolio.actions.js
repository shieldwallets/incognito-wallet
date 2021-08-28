import { otaKeyOfDefaultAccountSelector } from '@src/redux/selectors/account';
import { ExHandler } from '@src/services/exception';
import { getPDexV3Instance } from '@src/screens/PDexV3';
import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
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

export const actionFetch = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const { isFetching } = portfolioSelector(state);
    if (isFetching) {
      return;
    }
    await dispatch(actionFetching());
    const otaKey = otaKeyOfDefaultAccountSelector(state);
    const pDexV3Inst = await getPDexV3Instance({ otaKey });
    const listShare =
      [
        {
          token1IdStr:
            '0000000000000000000000000000000000000000000000000000000000000004',
          token1PoolValue: 10000000000,
          token2IdStr:
            '4584d5e9b2fc0337dfb17f4b5bb025e5b82c38cfa4f54e8a3d4fcdd03954ff82',
          token2PoolValue: 30000000000000,
          apy: 4,
          amp: 2,
          share: 10000,
          totalShare: 4000000,
          token1Reward: 10000000,
          token2Reward: 1000000,
          nfct: 'blah blah blah',
          poolId: '111'
        },
        {
          token1IdStr:
            '0000000000000000000000000000000000000000000000000000000000000004',
          token1PoolValue: 1500000000000,
          token2IdStr:
            'cd57197b44be6a7846c51a5ca5881f91f82afe33b47c2a7c6042fa4e4c646b81',
          token2PoolValue: 2000000000000,
          apy: 4,
          amp: 2,
          share: 10000,
          totalShare: 4000000,
          token1Reward: 10000000,
          token2Reward: 1000000,
          nfct: 'blah blah blah',
          poolId: '222'
        },
      ];
    // await pDexV3Inst.getListShare(otaKey);
    await dispatch(actionFetched(listShare));
  } catch (error) {
    new ExHandler(error).showErrorToast();
    await dispatch(actionFetchFail());
  }
};
