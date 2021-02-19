import React from 'react';
import { Image, StyleSheet } from 'react-native';
import QrCodeSrc from '@src/assets/images/icons/qr_code.png';
import { TouchableOpacity } from '@src/components/core';
import PropTypes from 'prop-types';
import { generateTestId } from '@utils/misc';
import { TEST_HEADER } from '@src/constants/elements';

const styled = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
  },
});

const BtnQRCode = ({ source, ...rest }) => {
  return (
    <TouchableOpacity {...generateTestId(TEST_HEADER.BTN_QR_CODE)} {...rest}>
      <Image style={styled.icon} source={source} />
    </TouchableOpacity>
  );
};

BtnQRCode.defaultProps = {
  source: QrCodeSrc,
};

BtnQRCode.propTypes = {
  source: PropTypes.any,
};

export default BtnQRCode;
