import React, { memo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { styled } from '@screens/Shield/features/ShieldDecentralizeDescription/styled';
import Header from '@components/Header/Header';
import { withLayout_2 } from '@components/Layout';
import { useSelector } from 'react-redux';
import { selectedPrivacySeleclor } from '@src/redux/selectors';

const ShieldDecentralizeDescription = () => {
  const selectedPrivacy = useSelector(selectedPrivacySeleclor.selectedPrivacy);
  return (
    <View style={styled.wrapper}>
      <Header title={`Shield ${selectedPrivacy?.externalSymbol || selectedPrivacy?.symbol}`} />
      <ScrollView>
        <View>
          <Text>Test Description detail update later</Text>
        </View>
      </ScrollView>
    </View>
  );
};

ShieldDecentralizeDescription.propTypes = {};


export default withLayout_2(memo(ShieldDecentralizeDescription));
