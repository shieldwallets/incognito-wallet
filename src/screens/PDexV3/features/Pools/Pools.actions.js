import {
  defaultAccountSelector,
  otaKeyOfDefaultAccountSelector,
} from '@src/redux/selectors/account';
import { ExHandler } from '@src/services/exception';
import { getPDexV3Instance } from '@screens/PDexV3';
import { v4 } from 'uuid';
import { PRV } from '@src/constants/common';
import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
  ACTION_FETCHED_TRADING_VOLUME_24H,
  ACTION_FETCHED_LIST_POOLS,
  ACTION_FETCHED_LIST_POOLS_DETAIL,
  ACTION_FETCHED_LIST_POOLS_FOLLOWING,
} from './Pools.constant';
import { listPoolsFollowingSelector } from './Pools.selector';

export const actionFetchedTradingVolume24h = (payload) => ({
  type: ACTION_FETCHED_TRADING_VOLUME_24H,
  payload,
});

export const actionFetchedListPools = (payload) => ({
  type: ACTION_FETCHED_LIST_POOLS,
  payload,
});

export const actionFetchedListPoolsDetail = (payload) => ({
  type: ACTION_FETCHED_LIST_POOLS_DETAIL,
  payload,
});

export const actionFetchedListPoolsFollowing = (payload) => ({
  type: ACTION_FETCHED_LIST_POOLS_FOLLOWING,
  payload,
});

export const actionFetchTradingVolume24h = () => async (dispatch, getState) => {
  try {
    const state = getState();
    // const account = defaultAccountSelector(state);
    // const pDexV3Inst = await getPDexV3Instance({ account });
    const tradingVolume24h = 1e9;
    // await pDexV3Inst.getTradingVolume24h('all');
    dispatch(actionFetchedTradingVolume24h(tradingVolume24h));
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};

export const actionFetching = () => ({
  type: ACTION_FETCHING,
});

export const actionFetched = () => ({
  type: ACTION_FETCHED,
});

export const actionFetchFail = () => ({
  type: ACTION_FETCH_FAIL,
});

export const actionToggleFollowingPool = (poolId) => async (
  dispatch,
  getState,
) => {
  try {
    const state = getState();
    const account = defaultAccountSelector(state);
    const pDexV3Inst = await getPDexV3Instance({ account });
    const listPoolsFollowing = listPoolsFollowingSelector(state);
    const isFollowed =
      listPoolsFollowing.findIndex((_poolId) => _poolId === poolId) > -1;
    if (isFollowed) {
      await pDexV3Inst.removeFollowingPool({ poolId });
    } else {
      await pDexV3Inst.addFollowingPool({ poolId });
    }
    const newList = await pDexV3Inst.getListFollowingPools();
    dispatch(actionFetchedListPoolsFollowing(newList));
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};

export const actionFetchListPools = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const account = defaultAccountSelector(state);
    const pDexV3Inst = await getPDexV3Instance({ account });
    let listPools = [];
    // await pDexV3Inst.getListPools();

    let listPoolsDetail =
      // await pDexV3Inst.getListPoolsDetail(poolsIDs);
      [
        {
          poolId: '111',
          token1Value: 100000,
          token2Value: 10000,
          token1Id:
            '4584d5e9b2fc0337dfb17f4b5bb025e5b82c38cfa4f54e8a3d4fcdd03954ff82',
          token2Id:
            '0000000000000000000000000000000000000000000000000000000000000004',
          share: 152323,
          volume: 132130,
          '24H': 5,
          price: 10,
          amp: 2,
          apy: 60,
          verified: true,
          priceChange: 12123,
        },
        {
          poolId: '222',
          token1Value: 100000,
          token2Value: 10000,
          token1Id:
            '4584d5e9b2fc0337dfb17f4b5bb025e5b82c38cfa4f54e8a3d4fcdd03954ff82',
          token2Id:
            '0000000000000000000000000000000000000000000000000000000000000004',
          share: 152323,
          volume: 2233,
          '24H': -10,
          price: 10,
          amp: 2,
          apy: 40,
          verified: false,
          priceChange: 24424,
        },
        {
          '24H': 69,
          amp: 2,
          apy: 60,
          poolId: '111',
          price: 10,
          priceChange: 12123,
          share: 152323,
          token1Id:
            'ffd8d42dc40a8d166ea4848baf8b5f6e9fe0e9c30d60062eb7d44a8df9e00854',
          token1Value: 100000,
          token2Id:
            'fdd928bc86c82bd2a7c54082a68332ebb5f2cde842b1c2e0fa430ededb6e369e',
          token2Value: 10000,
          verified: true,
          volume: 132130,
        },
        {
          '24H': 24,
          amp: 2,
          apy: 60,
          poolId: '1116',
          price: 10,
          priceChange: 12123,
          share: 152323,
          token1Id: PRV.id,
          token1Value: 805233000e9,
          token2Id:
            'fdd928bc86c82bd2a7c54082a68332ebb5f2cde842b1c2e0fa430ededb6e369e',
          token2Value: 1598796000000e6,
          verified: true,
          volume: 132130,
        },
        {
          '24H': 12,
          amp: 2,
          apy: 60,
          poolId: '1117',
          price: 10,
          priceChange: 12123,
          share: 152323,
          token1Id:
            'a61df4d870c17a7dc62d7e4c16c6f4f847994403842aaaf21c994d1a0024b032',
          token1Value: 805233000e9,
          token2Id:
            'fdd928bc86c82bd2a7c54082a68332ebb5f2cde842b1c2e0fa430ededb6e369e',
          token2Value: 1598796000000e6,
          verified: true,
          volume: 132130,
        },
      ];
    // await pDexV3Inst.getListPoolsDetail(poolsIDs);
    listPoolsDetail = listPoolsDetail.filter(
      (pool) => !!pool?.poolId && !!pool?.token1Id && !!pool?.token2Id,
    );
    dispatch(actionFetchedListPools([...listPoolsDetail]));
    const poolsIDs = listPoolsDetail.map((pool) => pool.poolId);
    await pDexV3Inst.addListFollowingPool({ poolsIDs });
    // const isFollowedDefaultListPools = await pDexV3Inst.isFollowedDefaultPools();
    // if (!isFollowedDefaultListPools) {
    //   await pDexV3Inst.followingDefaultPools({ poolsIDs });
    // }
  } catch (error) {
    throw error;
  }
};

export const actionFetchListFollowingPools = () => async (
  dispatch,
  getState,
) => {
  try {
    const state = getState();
    const account = defaultAccountSelector(state);
    const pDexV3Inst = await getPDexV3Instance({ account });
    const listPoolsFollowing = await pDexV3Inst.getListFollowingPools();
    await dispatch(actionFetchedListPoolsFollowing(listPoolsFollowing));
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};

export const actionFetch = () => async (dispatch, getState) => {
  try {
    await dispatch(actionFetching());
    await Promise.all([
      dispatch(actionFetchTradingVolume24h()),
      dispatch(actionFetchListPools()),
    ]);
    await dispatch(actionFetchListFollowingPools());
    dispatch(actionFetched());
  } catch (error) {
    new ExHandler(error).showErrorToast();
    dispatch(actionFetchFail());
  }
};
