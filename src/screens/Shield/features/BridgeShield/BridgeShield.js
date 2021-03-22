import React, { memo } from 'react';
import { View } from 'react-native';
import Form from '@screens/Shield/features/BridgeShield/features/Form/Form';
import { Header } from '@src/components';
import { useSelector } from 'react-redux';
import { selectedPrivacySeleclor } from '@src/redux/selectors';
import { withLayout_2 } from '@components/Layout';

const BridgeShield = memo(() => {
  const selectedPrivacy = useSelector(selectedPrivacySeleclor.selectedPrivacy);
  return (
    <View style={{ flex: 1 }}>
      <Header title={`Shield ${selectedPrivacy?.externalSymbol}`} accountSelectable />
      <Form />
    </View>
  );
});

BridgeShield.propTypes = {};

export default withLayout_2(BridgeShield);