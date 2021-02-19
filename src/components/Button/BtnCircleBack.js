import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { CircleBack } from '@src/components/Icons';
import PropTypes from 'prop-types';
import { generateTestId } from '@utils/misc';
import { TEST_HEADER } from '@src/constants/elements';

const styled = StyleSheet.create({
  btnStyle: {
    width: 34,
    height: 34,
    justifyContent: 'center',
  },
});

const BtnCircleBack = props => {
  const { btnStyle } = props;
  return (
    <TouchableOpacity
      style={[styled.btnStyle, btnStyle]}
      {...generateTestId(TEST_HEADER.BTN_BACK)}
      {...props}
    >
      <CircleBack />
    </TouchableOpacity>
  );
};

BtnCircleBack.defaultProps = {
  btnStyle: null,
};

BtnCircleBack.propTypes = {
  btnStyle: PropTypes.any,
};

export default BtnCircleBack;
