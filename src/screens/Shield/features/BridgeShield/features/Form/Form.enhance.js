import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { compose } from 'recompose';
import { enhanceInit } from '@screens/Shield/features/BridgeShield/features/Form/Form.enhanceInit';
import { change, focus } from 'redux-form';
import { formName , withAddress } from '@screens/Shield/features/BridgeShield/features/Form';
import { useDispatch, useSelector } from 'react-redux';
import { selectedPrivacySeleclor } from '@src/redux/selectors';
import format from '@utils/format';
import { fieldName } from '@screens/Shield/features/BridgeShield/features/Form/Form.constants';
import { enhanceData } from '@screens/Shield/features/BridgeShield/features/Form/Form.enhanceData';
import withAccount from '@screens/DexV2/components/account.enhance';


const enhance = WrappedComp => props => {

  const dispatch = useDispatch();

  const selectedPrivacy = useSelector(selectedPrivacySeleclor.selectedPrivacy);

  const maxTokenAmount = format.amount(
    selectedPrivacy?.amount,
    selectedPrivacy?.pDecimals,
    true,
  );

  const onChangeField = async (value, field) => {
    dispatch(change(formName, field, String(value)));
    dispatch(focus(formName, field));
  };

  const onPressMax = () => {
    onChangeField(`${maxTokenAmount}`, fieldName.amount).then();
  };

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          maxTokenAmount,

          onChangeField,
          onPressMax,
        }}
      />
    </ErrorBoundary>
  );
};

export default compose(
  withAccount,
  enhanceData,
  enhanceInit,
  enhance,
  withAddress,
);
