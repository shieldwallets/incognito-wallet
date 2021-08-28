import React, {memo} from 'react';
import {View, StyleSheet } from 'react-native';
import {Divider} from 'react-native-elements';
import {Image} from '@components/core';
import addIcon from '@assets/images/icons/add_liquidity.png';
import PropTypes from 'prop-types';

import { COLORS } from '@src/styles';

export const styled = StyleSheet.create({
  arrowWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
  },
  arrow: {
    marginHorizontal: 7.5,
    height: 40,
    resizeMode: 'contain',
  },
  divider: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.lightGrey5,
  },
});

const AddBreakLine = ({ style }) => (
  <View style={[styled.arrowWrapper, style]}>
    <Divider style={styled.divider} />
    <Image source={addIcon} style={styled.arrow} />
    <Divider style={styled.divider} />
  </View>
);

AddBreakLine.propTypes = {
  onSwapButtons: PropTypes.func.isRequired,
  style: PropTypes.any,
};

export default memo(AddBreakLine);
