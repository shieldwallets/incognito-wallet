import React, { memo } from 'react';
import {Text, View} from 'react-native';
import PropTypes from 'prop-types';
import style from '@screens/Shield/features/BridgeShield/components/BridgeStep/style';
import StepIndicator from 'react-native-step-indicator';

const STEPS = ['Approve', 'Send', 'Mint' ];

const BridgeStep = () => {
  const renderItem = (item, index) => (
    <View style={[style.item, index === 0 && { justifyContent: 'flex-start' }, index === STEPS.length - 1  && { justifyContent: 'flex-end' }]}>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: 'gray', borderRadius: 15 }}>
          <Text style={{ color: 'white' }}>{index}</Text>
          <View style={{ position: 'absolute', height: 10,  width: 100, backgroundColor: 'red', left: 35 }} />
        </View>
        <Text style={style.text}>{item}</Text>
      </View>
    </View>
  );

  return (
    <View style={style.container}>
      {STEPS.map(renderItem)}
    </View>
  );
};

BridgeStep.propTypes = {};


export default memo(BridgeStep);