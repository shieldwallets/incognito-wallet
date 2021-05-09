import React, { memo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { styled } from '@screens/Shield/features/ShieldDecentralizeDescription/styled';
import Header from '@components/Header/Header';
import { withLayout_2 } from '@components/Layout';

const ShieldDecentralizeDescription = () => {
  return (
    <View style={styled.wrapper}>
      <Header title="Shield decentralize" />
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
