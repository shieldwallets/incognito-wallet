import {getDefaultAccountWalletSelector, getPDex3InstanceSelector} from '@src/redux/selectors/shared';
import TYPES from '@screens/PDexV3/features/ContributeHistories/ContributeHistories.constants';
import {contributeHistoriesSelector} from '@screens/PDexV3/features/ContributeHistories/ContributeHistories.selector';

const actionSetHistories = ({ histories, originalHistories, offset, isEnd }) => ({
  type: TYPES.ACTION_SET_HISTORIES,
  payload: { histories, originalHistories, offset, isEnd }
});

const actionFetchData = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const pDexV3Inst = getPDex3InstanceSelector(state);
    const accountWallet = getDefaultAccountWalletSelector(state);
    const { originalHistories, offset } = contributeHistoriesSelector(state);
    const histories = await pDexV3Inst.getContributeHistories({ accountInst: accountWallet });
    dispatch(actionSetHistories({ histories }));
  } catch (error) {
    console.log('[contribute histories] actionFetchData: ', error);
  }
};

export default ({
  actionFetchData,
});
