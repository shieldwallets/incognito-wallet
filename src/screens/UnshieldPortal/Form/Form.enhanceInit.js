/* eslint-disable import/no-cycle */
import React from 'react';
import {
  selectedPrivacySelector,
  sharedSelector,
} from '@src/redux/selectors';
import { Clipboard } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { change, focus, formValueSelector } from 'redux-form';
import { LoadingContainer } from '@src/components/core';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { defaultAccountSelector } from '@src/redux/selectors/account';
import { removeAllSpace, standardizedAddress } from './Form.utils';

export const formName = 'formUnshieldPortal';

export const enhanceInit = (WrappedComp) => (props) => {
  const dispatch = useDispatch();
  const { navigation } = props;
  const selectedPrivacy = useSelector(selectedPrivacySelector.selectedPrivacy);
  const gettingBalance = useSelector(sharedSelector.isGettingBalance);
  const isGettingBalance = gettingBalance.includes(selectedPrivacy?.tokenId);
  const account = useSelector(defaultAccountSelector);
  const selector = formValueSelector(formName);
  const amount = useSelector((state) => selector(state, 'amount'));
  const toAddress = useSelector((state) => selector(state, 'toAddress'));

  const handleStandardizedAddress = async (value) => {
    let _value = value;
    try {
      const copiedValue = await Clipboard.getString();
      if (copiedValue !== '') {
        const isPasted = value.includes(copiedValue);
        if (isPasted) {
          _value = standardizedAddress(value);
        }
      }
    } catch (e) {
      console.debug('error', e);
    }
    return removeAllSpace(_value);
  };

  const onChangeField = async (value, field) => {
    let _value = value;
    if (field === 'toAddress') {
      _value = await handleStandardizedAddress(value);
    }

    dispatch(change(formName, field, String(_value)));
    dispatch(focus(formName, field));
  };

  React.useEffect(() => {
    const { toAddress, amount } = navigation.state?.params || {};
    if (toAddress) {
      onChangeField(toAddress, 'toAddress');
    }
    if (amount) {
      onChangeField(amount, 'amount');
    }
  }, [navigation.state?.params]);

  if (!selectedPrivacy || isGettingBalance) {
    return <LoadingContainer />;
  }
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          balancePRV: account?.value,
          onChangeField,
          handleStandardizedAddress,
          amount,
          toAddress,
        }}
      />
    </ErrorBoundary>
  );
};
