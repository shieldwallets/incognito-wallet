import React from 'react';
import { Image, StyleSheet } from 'react-native';
import srcScanQrCode from '@src/assets/images/icons/qr_code_scan.png';
import { TouchableOpacity } from '@src/components/core';
import { generateTestId } from '@utils/misc';
import { TEST_SEND } from '@src/constants/elements';

const styled = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
  },
});

const BtnScanQrCode = props => {
  return (
    <TouchableOpacity {...generateTestId(TEST_SEND.BTN_QR_CODE)} {...props}>
      <Image style={styled.icon} source={srcScanQrCode} />
    </TouchableOpacity>
  );
};

BtnScanQrCode.propTypes = {};

export default BtnScanQrCode;
