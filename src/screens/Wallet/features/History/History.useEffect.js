import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { accountSelector, selectedPrivacySelector } from '@src/redux/selectors';
import { ExHandler } from '@src/services/exception';
import { getBalance as getAccountBalance } from '@src/redux/actions/account';
import { actionFetch as actionFetchHistory } from '@src/redux/actions/history';
import { switchAccountSelector } from '@src/redux/selectors/account';
import { walletSelector } from '@src/redux/selectors/wallet';
import { getBalance as getTokenBalance } from '@src/redux/actions/token';
import { useFocusEffect } from 'react-navigation-hooks';
import { PrivacyVersion } from 'incognito-chain-web-js/build/wallet';

export const useHistoryEffect = (props) => {
  const { version = PrivacyVersion.ver2 } = props || {};
  const wallet = useSelector(walletSelector);
  const account = useSelector(accountSelector.defaultAccountSelector);
  const dispatch = useDispatch();
  const switchAccount = useSelector(switchAccountSelector);
  const selectedPrivacy = useSelector(selectedPrivacySelector.selectedPrivacy);
  const handleRefresh = async () => {
    try {
      switch (version) {
      case PrivacyVersion.ver2: {
        if (selectedPrivacy.isMainCrypto) {
          await dispatch(getAccountBalance(account));
        } else if (selectedPrivacy.isToken) {
          await dispatch(getTokenBalance(selectedPrivacy.tokenId));
        }
        break;
      }
      default:
        break;
      }
      await dispatch(actionFetchHistory({ version }));
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };
  const handleCancelEtaHistory = async (history) => {
    try {
      // const data = await removeHistory({
      //   historyId: history?.id,
      //   currencyType: history?.currencyType,
      //   isDecentralized: history?.decentralized,
      //   signPublicKeyEncode,
      // });
      // if (data) {
      //   Toast.showSuccess('Canceled');
      //   handleLoadHistory(true);
      // }
    } catch (e) {
      new ExHandler(e).showErrorToast();
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      if (!switchAccount) {
        handleRefresh();
      }
    }, [
      selectedPrivacy.tokenId,
      account.PaymentAddress,
      wallet,
      switchAccount,
    ]),
  );
  return {
    handleRefresh,
    handleCancelEtaHistory,
  };
};
