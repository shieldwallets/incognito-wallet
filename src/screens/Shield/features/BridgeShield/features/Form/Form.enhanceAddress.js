import React from 'react';
import {fieldName} from '@screens/Shield/features/BridgeShield/features/Form/Form.constants';

const enhanceAddress = WrappedComp => props => {
  const { paymentAddress, onChangeField } = props;
  React.useEffect(() => {
    onChangeField && onChangeField(paymentAddress, fieldName.incAddress);
  }, [paymentAddress]);
  return (
    <WrappedComp
      {...{...props,}}
    />
  );
};

export default enhanceAddress;