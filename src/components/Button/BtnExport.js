import React from 'react';
import { TouchableOpacity } from '@src/components/core';
import { generateTestId } from '@utils/misc';
import {TEST_KEYCHAIN} from '@src/constants/elements';
import { ExportIcon } from '../Icons';

const BtnExport = (props) => {
  return (
    <TouchableOpacity
      {...generateTestId(TEST_KEYCHAIN.BTN_DETAIL_KEYCHAIN)}
      {...props}
    >
      <ExportIcon />
    </TouchableOpacity>
  );
};

BtnExport.propTypes = {};

export default BtnExport;
