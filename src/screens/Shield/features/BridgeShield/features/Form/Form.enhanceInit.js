import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useDispatch, useSelector } from 'react-redux';
import {accountSeleclor, selectedPrivacySeleclor, sharedSeleclor} from '@src/redux/selectors';
import { reset } from 'redux-form';
import { formName } from '@screens/Shield/features/BridgeShield/features/Form/Form.constants';
import {LoadingContainer} from '@components/core';

export const enhanceInit = WrappedComp => props => {
  const dispatch = useDispatch();
  const selectedPrivacy = useSelector(selectedPrivacySeleclor.selectedPrivacy);
  const [init, setInit] = React.useState(true);
  const prvBalance = useSelector(accountSeleclor.defaultAccountBalanceSelector);
  const gettingBalance = useSelector(sharedSeleclor.isGettingBalance);
  const isGettingBalance = gettingBalance.includes(selectedPrivacy?.tokenId);

  const initData = async () => {
    try {
      setInit(true);
      dispatch(reset(formName));
    } catch (error) {
      console.debug(error);
    } finally {
      setInit(false);
    }
  };

  React.useEffect(() => {
    initData().then();
  }, [selectedPrivacy?.tokenId]);

  if (!selectedPrivacy || init || isGettingBalance) {
    return <LoadingContainer />;
  }

  return (
    <ErrorBoundary>
      <WrappedComp {...props} />
    </ErrorBoundary>
  );
};