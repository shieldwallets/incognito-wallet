import React from 'react';
import PropTypes from 'prop-types';
import formatUtil from '@utils/format';
import { PRV } from '@services/wallet/tokenService';
import ExtraInfo from '@screens/DexV2/components/ExtraInfo';

const NetworkFee = React.memo(({ fee, title }) => {
  return (
    <ExtraInfo
      left={title}
      right={`${formatUtil.amountFull(fee, PRV.pDecimals)} ${PRV.symbol}`}
    />
  );
});

NetworkFee.defaultProps = {
  fee: 0,
  title: 'Network Fee'
};

NetworkFee.propTypes = {
  fee: PropTypes.number,
  title: PropTypes.string
};

export default NetworkFee;
