import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { withLayout_2 } from '@src/components/Layout';
import { compose } from 'recompose';
import { useFocusEffect } from 'react-navigation-hooks';
import withWallet from '@screens/Wallet/features/Home/Wallet.enhance';
import { useDispatch } from 'react-redux';
import { actionFree as actionFreeHistory } from '@src/redux/actions/history';
// import {
//   actionFreeReceiveHistory,
//   actionFreeHistory,
// } from '@src/redux/actions/token';

const enhance = (WrappedComp) => (props) => {
  const {
    retryLastTxsUnshieldDecentralized,
    retryLastTxsUnshieldCentralized,
  } = props;

  const dispatch = useDispatch();
  const handleFreeHistoryData = () => {
    try {
      dispatch(actionFreeHistory());
      // dispatch(actionFreeReceiveHistory());
      // dispatch(actionFreeHistory());
    } catch (error) {
      console.debug('ERROR', error);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      retryLastTxsUnshieldCentralized();
      retryLastTxsUnshieldDecentralized();
    }, []),
  );

  return (
    <ErrorBoundary>
      <WrappedComp {...{ ...props }} />
    </ErrorBoundary>
  );
};

export default compose(
  withWallet,
  enhance,
);
