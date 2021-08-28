import TYPES, {formConfigs} from '@screens/PDexV3/features/Contribute/Contribute.constant';
import { ExHandler } from '@services/exception';
import {
  contributeDataSelector,
  contributePoolIDSelector,
} from '@screens/PDexV3/features/Contribute/Contribute.selector';
import {calculateContributeValue, parseInputWithText} from '@screens/PDexV3/PDexV3.utils';
import Util from '@utils/Util';
import {pDexV3Selector} from '@screens/PDexV3';
import {batch} from 'react-redux';
import { change } from 'redux-form';
import {getBalance} from '@src/redux/actions/token';

const actionUpdateContributePoolID = ({ poolId }) => ({
  type: TYPES.ACTION_UPDATE_POOL_ID,
  payload: poolId,
});

const actionUpdatePoolDetail = (payload) => ({
  type: TYPES.ACTION_UPDATE_POOL_DETAIL,
  payload,
});

const actionFetching = () => ({
  type: TYPES.ACTION_FETCHING,
});

const actionFetched = () => ({
  type: TYPES.ACTION_FETCHED,
});

const actionFetchFail = () => ({
  type: TYPES.ACTION_FETCH_FAIL,
});

const actionFeeContribute = () => ({
  type: TYPES.ACTION_FREE_CONTRIBUTE,
});

const actionSetToken = (payload) => ({
  type: TYPES.ACTION_SET_TOKEN_ID,
  payload
});

const actionFetchData = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const pdex3 = pDexV3Selector(state);
    const { isFetching } = pdex3?.contribute;
    if (isFetching) return;
    dispatch(actionFetching());
    /** mockup data, remove release */
    await Util.sleep(3000);
    const poolID = contributePoolIDSelector(state);
    const listPoolsDetail = [{
      poolId: poolID,
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
    }];
    if (listPoolsDetail.length > 0) {
      const poolDetail = listPoolsDetail.find(pool => pool.poolId === poolID);
      if (!poolDetail) return;
      const { token1Id, token2Id } = poolDetail;
      batch(() => {
        dispatch(actionUpdatePoolDetail(poolDetail));
        dispatch(getBalance(token1Id));
        dispatch(getBalance(token2Id));
        dispatch(actionSetToken({
          inputToken: token1Id,
          outputToken: token2Id,
        }));
      });
    }
  } catch (error) {
    dispatch(actionFetchFail());
    new ExHandler(error).showErrorToast();
  } finally {
    dispatch(actionFetched());
  }
};

const actionChangeInput = (newInput) => async (dispatch, getState) => {
  try {
    const state = getState();
    const { inputToken, outputToken, token1PoolValue, token2PoolValue, } = contributeDataSelector(state);
    dispatch(change(formConfigs.formName, formConfigs.inputToken, newInput));
    const inputValue = parseInputWithText({ text: newInput, token: inputToken });
    const outputText = calculateContributeValue({
      inputValue,
      outputToken,
      inputPool: token1PoolValue,
      outputPool: token2PoolValue,
      isInput: true
    });
    batch(() => {
      dispatch(change(formConfigs.formName, formConfigs.outputToken, outputText));
    });
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};

const actionChangeOutput = (newOutput) => async (dispatch, getState) => {
  try {
    const state = getState();
    const { inputToken, outputToken, token1PoolValue, token2PoolValue, } = contributeDataSelector(state);
    const outputValue = parseInputWithText({ text: newOutput, token: outputToken });
    const inputText = calculateContributeValue({
      inputValue: outputValue,
      outputToken: inputToken,
      inputPool: token2PoolValue,
      outputPool: token1PoolValue,
      isInput: true
    });
    batch(() => {
      dispatch(change(formConfigs.formName, formConfigs.inputToken, inputText));
      dispatch(change(formConfigs.formName, formConfigs.outputToken, newOutput));
    });
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};

export default ({
  actionUpdateContributePoolID,
  actionUpdatePoolDetail,
  actionFetchData,
  actionChangeInput,
  actionChangeOutput,
  actionFeeContribute,
});
