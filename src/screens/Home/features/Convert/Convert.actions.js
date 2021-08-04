import { walletSelector } from '@src/redux/selectors/wallet';
import { accountSelector } from '@src/redux/selectors';
import accountService from '@services/wallet/accountService';
import { switchAccountSelector } from '@src/redux/selectors/account';
import { TYPES } from '@screens/Home/features/Convert/Convert.actionsName';
import {getDefaultAccountWalletSelector} from '@src/redux/selectors/shared';
import {isEmpty} from 'lodash';
import {convertCoinsDataSelector} from '@screens/Home/features/Convert/Convert.selector';
import {ExHandler} from '@services/exception';
import {actionLogEvent} from '@screens/Performance';
import {batch} from 'react-redux';

export const actionFetched = (payload) => ({
  type: TYPES.ACTION_FETCH_COINS_V1,
  payload
});

export const actionClearConvertData = () => ({
  type: TYPES.ACTION_CLEAR_CONVERT_DATA,
});

export const actionFetching = (payload) => ({
  type: TYPES.ACTION_FETCHING_COINS_V1,
  payload
});

export const actionRefreshing = (payload) => ({
  type: TYPES.ACTION_REFRESHING_COINS_V1,
  payload
});

export const actionConverting = (payload) => ({
  type: TYPES.ACTION_CONVERTING,
  payload
});

export const actionUpdateCurrentConvertStep = (payload) => ({
  type: TYPES.ACTION_UPDATE_CURRENT_CONVERT_STEP,
  payload
});

export const actionUpdateConvertMessages = (payload) => ({
  type: TYPES.ACTION_UPDATE_CONVERT_MESSAGE,
  payload
});

export const actionConverted = () => ({
  type: TYPES.ACTION_CONVERTED,
});

export const actionUpdatePercentConvert = (payload) => ({
  type: TYPES.ACTION_UPDATE_PERCENT_CONVERT,
  payload
});

export const actionFetchCoinsV1 = (isRefresh = false) => async (dispatch, getState) => {
  let hasUnspentCoins = false;
  let data = { unspentCoins: [], address: undefined };

  const state = getState();
  const switchingAccount = switchAccountSelector(state);
  if(switchingAccount) return hasUnspentCoins;

  try {
    if (isRefresh) {
      dispatch(actionRefreshing(true));
    } else {
      dispatch(actionClearConvertData());
    }
    dispatch(actionFetching(true));
    const wallet = walletSelector(state);
    const account = accountSelector.defaultAccountSelector(state);
    const address = account.PaymentAddress;
    let unspentCoins = await accountService.getUnspentCoinsV1({ account, wallet });
    data = { unspentCoins, address };
  } catch (error) {
    dispatch(actionLogEvent({ desc: error }));
    console.log('ACTION FETCH COINS V1 error: ', JSON.stringify(error));
    new ExHandler(error).showErrorToast(true);
  } finally {
    dispatch(actionFetched({ data }));
  }
};

export const actionConvertCoins = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const switchingAccount = switchAccountSelector(state);
    if(switchingAccount) return;
    dispatch(actionConverting(true));
    const { prvUnspent, pTokenUnspent } = convertCoinsDataSelector(state);
    const accountWallet = getDefaultAccountWalletSelector(state);
    if (!isEmpty(prvUnspent)) {
      const { tokenID, unspentCoins } = prvUnspent;
      const totalCoinsConvert = unspentCoins.length;
      let errorMessage = undefined;
      try {
        dispatch(actionUpdateCurrentConvertStep(tokenID));
        const txHandler = ({ timeCreate, remainInputCoins, tokenID, txId: txID }) => {
          const percent = Math.ceil((1 - (remainInputCoins / totalCoinsConvert)) * 100);
          const log = { tokenID, txID, timeCreate, remainInputCoins };
          batch(() => {
            dispatch(actionLogEvent({ desc: log }));
            dispatch(actionUpdatePercentConvert({ tokenID, percent }));
          });
        };
        await accountWallet.createAndSendConvertNativeToken({ tokenID, txHandler });
      } catch (error) {
        errorMessage = new ExHandler(error).getMessage(error?.message);
      } finally {
        dispatch(actionUpdateConvertMessages({ tokenID, errorMessage }));
      }
    }

    if (!isEmpty(pTokenUnspent)) {
      for (const coin of pTokenUnspent) {
        const { tokenID, unspentCoins } = coin;
        const totalCoinsConvert = unspentCoins.length;
        let errorMessage = undefined;
        try {
          const txHandler = ({ timeCreate, remainInputCoins, tokenID, txId: txID }) => {
            const percent = Math.ceil((1 - (remainInputCoins / totalCoinsConvert)) * 100);
            const log = { tokenID, txID, timeCreate, remainInputCoins };
            batch(() => {
              dispatch(actionLogEvent({ desc: log }));
              dispatch(actionUpdatePercentConvert({ tokenID, percent }));
            });
          };
          dispatch(actionUpdateCurrentConvertStep(tokenID));
          await accountWallet.createAndSendConvertPToken({ tokenID, txHandler });
        } catch (error) {
          errorMessage = new ExHandler(error).getMessage(error?.message);
        } finally {
          dispatch(actionUpdateConvertMessages({ tokenID, errorMessage }));
        }
      }
    }

  } catch (error) {
    console.log('ACTION CONVERT COINS V1 error: ', error);
  } finally {
    dispatch(actionConverted());
  }
};
