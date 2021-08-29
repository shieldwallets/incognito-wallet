import TYPES from '@screens/PDexV3/features/ProvideHome/ProvideHome.constant';
import {defaultAccountSelector} from '@src/redux/selectors/account';
import {getPDexV3Instance} from '@screens/PDexV3';
import {ExHandler} from '@services/exception';
import {statusProvideSelector} from '@screens/PDexV3/features/ProvideHome';

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

const actionFetch = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const { isLoading } = statusProvideSelector(state);
    if (isLoading) return;
    dispatch(actionFetching());
    const account = defaultAccountSelector(state);
    const pDexV3Inst = await getPDexV3Instance({ account });
    const data = await pDexV3Inst.getProvideData();
    console.log('SANG TEST: ', data);
    dispatch(actionUpdateData(data));
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
