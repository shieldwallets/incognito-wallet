import React from 'react';
import { Switch } from '@components/core';
import Section, { sectionStyle } from '@screens/Setting/features/Section';
import { Text, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { actionToggleCurrency, currencySelector } from '@screens/Setting';
import { generateTestId } from '@utils/misc';
import { TEST_SETTING } from '@src/constants/elements';

const CurrencySection = () => {
  const dispatch = useDispatch();

  const toggle = useSelector(currencySelector);
  const onToggleValue = () => dispatch(actionToggleCurrency());

  return (
    <Section
      label='Currency display'
      customItems={[
        <View
          key='currency-display'
          onPress={toggle}
          style={sectionStyle.subItem}
        >
          <Text
            {...generateTestId(TEST_SETTING.LBL_DESC)}
            style={sectionStyle.desc}
          >
            Display in USD instead of PRV
          </Text>
          <Switch
            onValueChange={onToggleValue}
            value={toggle}
          />
        </View>,
      ]}
    />
  );
};

export default React.memo(CurrencySection);