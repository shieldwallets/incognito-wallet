import React from 'react';
import { TouchableOpacity } from 'react-native';
import { CopyIcon } from '@src/components/Icons';
import { generateTestId } from '@utils/misc';
import { TEST_RECEIVE_CRYPTO } from '@src/constants/elements';

const BtnCopy = (props) => {
  const { ...rest } = props;
  return (
    <TouchableOpacity {...generateTestId(TEST_RECEIVE_CRYPTO.BTN_COPY)} {...rest}>
      <CopyIcon />
    </TouchableOpacity>
  );
};

export default BtnCopy;
