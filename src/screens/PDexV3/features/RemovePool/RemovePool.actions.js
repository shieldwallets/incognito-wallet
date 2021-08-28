import TYPES, {formConfigs} from '@screens/PDexV3/features/RemovePool/RemovePool.constant';
import {actionFetch as actionFetchPortfolio, getDataShareByPoolIdSelector} from '@screens/PDexV3/features/Portfolio';
import {ExHandler} from '@services/exception';
import Util from '@utils/Util';
import {parseInputWithText} from '@screens/PDexV3';
import {
  maxShareAmountSelector,
  poolIDSelector,
  removePoolSelector,
  tokenSelector
} from '@screens/PDexV3/features/RemovePool';
import {change} from 'redux-form';
import {batch} from 'react-redux';
import {getBalance} from '@src/redux/actions/token';
import BigNumber from 'bignumber.js';
import formatUtils from '@utils/format';

export const actionFetching = () => ({
  type: TYPES.ACTION_FETCHING,
});

export const actionFetched = (payload) => ({
  type: TYPES.ACTION_FETCHED,
  payload,
});

export const actionFetchFail = () => ({
  type: TYPES.ACTION_FETCH_FAIL,
});

const actionSetPoolID = (payload) => ({
  type: TYPES.ACTION_UPDATE_POOL_ID,
  payload,
});

const actionSetToken = ({ inputTokenID, outputTokenID }) => ({
  type: TYPES.ACTION_SET_TOKEN_ID,
  payload: { inputTokenID, outputTokenID },
});

const actionFetch = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const { inputToken, outputToken } = removePoolSelector(state);
    const tasks = [
      dispatch(actionFetching()),
      dispatch(actionFetchPortfolio()),
    ];
    if (inputToken && outputToken) {
      tasks.push(dispatch(getBalance(inputToken)));
      tasks.push(dispatch(getBalance(outputToken)));
    }
    await Promise.all(tasks);
    await Util.sleep();
  } catch (error) {
    new ExHandler(error).showErrorToast();
  } finally {
    dispatch(actionFetched());
  }
};

const actionChangeInput = (newText) => async (dispatch, getState) => {
  try {
    const state = getState();
    const { inputToken, outputToken } = tokenSelector(state);
    const maxShareData = maxShareAmountSelector(state);
    const {
      maxInputShare,
      maxOutputShare,
    } = maxShareData;
    const inputValue = parseInputWithText({ text: newText, token: inputToken });
    const outputValue = new BigNumber(inputValue).multipliedBy(maxOutputShare).dividedBy(maxInputShare).toNumber();
    const outputText = formatUtils.amountFull(Math.floor(outputValue), outputToken.pDecimals);
    batch(() => {
      dispatch(change(formConfigs.formName, formConfigs.inputToken, newText));
      dispatch(change(formConfigs.formName, formConfigs.outputToken, outputText));
    });
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};

const actionChangeOutput = (newText) => async (dispatch, getState) => {
  try {
    const state = getState();
    const { inputToken, outputToken } = tokenSelector(state);
    const maxShareData = maxShareAmountSelector(state);
    const {
      maxInputShare,
      maxOutputShare,
    } = maxShareData;
    const outputValue = parseInputWithText({ text: newText, token: inputToken });
    const inputValue = new BigNumber(outputValue).multipliedBy(maxInputShare).dividedBy(maxOutputShare).toNumber();
    const inputText = formatUtils.amountFull(Math.ceil(inputValue), outputToken.pDecimals);
    batch(() => {
      dispatch(change(formConfigs.formName, formConfigs.inputToken, inputText));
      dispatch(change(formConfigs.formName, formConfigs.outputToken, newText));
    });
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};

const actionRemoveMax = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const maxShareData = maxShareAmountSelector(state);
    const {
      maxInputShareStr,
      maxOutputShareStr,
    } = maxShareData;
    batch(() => {
      dispatch(change(formConfigs.formName, formConfigs.inputToken, maxInputShareStr));
      dispatch(change(formConfigs.formName, formConfigs.outputToken, maxOutputShareStr));
    });
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};

export default ({
  actionSetPoolID,
  actionSetToken,
  actionChangeInput,
  actionChangeOutput,
  actionFetch,
  actionRemoveMax,
});
