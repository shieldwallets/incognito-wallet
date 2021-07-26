import React from 'react';
import { TouchableOpacity, Text } from '@src/components/core';
import { COLORS, FONT } from '@src/styles';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const style = StyleSheet.create({
  text: {
    ...FONT.STYLE.medium,
    fontSize: 15,
    color: COLORS.black,
  },
});

const BtnResume = (props) => {
  const { resuming, ...rest } = props;
  return (
    <TouchableOpacity {...rest}>
      <Text style={style.text}>{`Resume${resuming ? '...' : ''}`}</Text>
    </TouchableOpacity>
  );
};

BtnResume.propTypes = {
  resuming: PropTypes.bool,
};

export default React.memo(BtnResume);
