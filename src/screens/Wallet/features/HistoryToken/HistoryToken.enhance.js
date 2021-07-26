import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { ExHandler } from '@src/services/exception';
import { accountSelector, selectedPrivacySelector } from '@src/redux/selectors';
import { useSelector, useDispatch } from 'react-redux';
import { removeHistory } from '@src/services/api/history';
import { Toast } from '@src/components/core';
import { actionFetchHistoryToken } from '@src/redux/actions/token';

const enhance = (WrappedComp) => (props) => {
  const selectedPrivacy = useSelector(selectedPrivacySelector.selectedPrivacy);
  const signPublicKeyEncode = useSelector(
    accountSelector.signPublicKeyEncodeSelector,
  );

  const dispatch = useDispatch();
  const handleLoadHistory = async (refreshing) => {
    try {
      if (selectedPrivacy?.isToken) {
        dispatch(actionFetchHistoryToken(refreshing));
      }
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };
  const handleCancelEtaHistory = async (history) => {
    try {
      const data = await removeHistory({
        historyId: history?.id,
        currencyType: history?.currencyType,
        decentralized: history?.decentralized,
        signPublicKeyEncode,
      });
      if (data) {
        Toast.showSuccess('Canceled');
        handleLoadHistory(true);
      }
    } catch (e) {
      new ExHandler(
        e,
        'Cancel this transaction failed, please try again.',
      ).showErrorToast();
    }
  };
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          handleCancelEtaHistory,
          handleLoadHistory,
        }}
      />
    </ErrorBoundary>
  );
};

export default enhance;
