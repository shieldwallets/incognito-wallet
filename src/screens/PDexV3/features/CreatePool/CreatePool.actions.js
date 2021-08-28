import TYPES, {formConfigs} from '@screens/PDexV3/features/CreatePool/CreatePool.constant';
import {ExHandler} from '@services/exception';
import {change} from 'redux-form';
import {tokenSelector} from '@screens/PDexV3/features/CreatePool/CreatePool.selector';
import {allTokensIDsSelector} from '@src/redux/selectors/token';
import {batch} from 'react-redux';
import {getBalance} from '@src/redux/actions/token';

const actionSetInputTokenIDStr = (payload) => ({
  type: TYPES.ACTION_SET_INPUT_TOKEN_IDSTR,
  payload,
});
const actionSetOutputTokenIDStr = (payload) => ({
  type: TYPES.ACTION_SET_OUTPUT_TOKEN_IDSTR,
  payload,
});

const actionChangeInput = ({ text, field }) => async (dispatch) => {
  try {
    dispatch(change(formConfigs.formName, field, text));
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};

const actionChangeInputTokenIDStr = (tokenID) => async (dispatch, getState) => {
  try {
    const state = getState();
    const { inputToken, outputToken } = tokenSelector(state);
    if (outputToken && tokenID === outputToken.tokenId) {
      batch(() => {
        dispatch(actionSetOutputTokenIDStr(inputToken.tokenId));
        dispatch(getBalance(inputToken.tokenId));
      });
    }
    batch(() => {
      dispatch(actionSetInputTokenIDStr(tokenID));
      dispatch(getBalance(tokenID));
    });
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};
const actionChangeOutputTokenIDStr = (tokenID) => async (dispatch, getState) => {
  try {
    const state = getState();
    const { inputToken, outputToken } = tokenSelector(state);
    if (inputToken && tokenID === inputToken?.tokenId) {
      batch(() => {
        dispatch(actionSetInputTokenIDStr(outputToken.tokenId));
        dispatch(getBalance(outputToken.tokenId));
      });
    }
    batch(() => {
      dispatch(actionSetOutputTokenIDStr(tokenID));
      dispatch(getBalance(tokenID));
    });
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};

const actionInit = () => (dispatch, getState) => {
  try {
    const state = getState();
    const { inputToken, outputToken } = tokenSelector(state);
    const tokenIDs = allTokensIDsSelector(state);
    let newInputToken = inputToken ? inputToken.tokenId : undefined;
    let newOutputToken = outputToken ? outputToken.tokenId : undefined;
    if (!inputToken) newInputToken = tokenIDs[0];
    if (!outputToken) newOutputToken = tokenIDs[1];
    batch(() => {
      dispatch(actionSetInputTokenIDStr(newInputToken));
      dispatch(actionSetOutputTokenIDStr(newOutputToken));
      dispatch(getBalance(newInputToken));
      dispatch(getBalance(newOutputToken));
      dispatch(change(formConfigs.formName, formConfigs.amp, '1'));
    });
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};

export default ({
  actionChangeInput,
  actionChangeInputTokenIDStr,
  actionChangeOutputTokenIDStr,
  actionInit,
});
