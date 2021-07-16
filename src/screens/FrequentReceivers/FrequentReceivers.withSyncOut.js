/* eslint-disable import/named */
import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useSelector, useDispatch } from 'react-redux';
import { pTokensSelector } from '@src/redux/selectors/token';
import { withdrawReceiversSelector } from '@src/redux/selectors/receivers';
import {
  detectNetworkNameSelector,
  actionToggleDetectNetworkName,
} from '@screens/GetStarted';
import { CONSTANT_KEYS } from '@src/constants';
import { selectedPrivacySelector } from '@src/redux/selectors';
import { trim } from 'lodash';
import { actionUpdate } from '@src/redux/actions/receivers';
import { getExternalSymbol } from './FrequentReceivers.utils';

const enhance = (WrappedComp) => (props) => {
  const pTokens = useSelector(pTokensSelector);
  const dispatch = useDispatch();
  const { receivers } = useSelector(withdrawReceiversSelector);
  const detectNetworkName = useSelector(detectNetworkNameSelector)[
    CONSTANT_KEYS.DETECT_NETWORK_NAME
  ];
  const getPrivacyDataByTokenID = useSelector(
    selectedPrivacySelector.getPrivacyDataByTokenID,
  );

  React.useEffect(() => {
  }, []);
  return (
    <ErrorBoundary>
      <WrappedComp {...props} />
    </ErrorBoundary>
  );
};

export default enhance;
