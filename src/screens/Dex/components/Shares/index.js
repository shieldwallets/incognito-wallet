import React, { memo } from 'react';
import PropTypes from 'prop-types';
import ExtraInfo from '@screens/DexV2/components/ExtraInfo';
import BigNumber from 'bignumber.js';
import formatUtil from '@utils/format';

const Shares = ({
  share,
  totalShare,
}) => {
  if(!share) return null;
  const getPercent = () => {
    const percent = formatUtil.toFixed(new BigNumber(share).dividedBy(totalShare || 1).multipliedBy(100).toNumber(), 7);
    return `(${percent}%)`;
  };
  const rightText = `${share} ${getPercent()}`;
  if (!rightText) return null;
  return (
    <ExtraInfo
      left="Shares"
      right={rightText}
    />
  );
};

Shares.defaultProps = {
  showPercent: true,
};
Shares.propTypes = {
  share: PropTypes.number.isRequired,
  totalShare: PropTypes.number.isRequired,
  showPercent: PropTypes.bool,
};


export default memo(Shares);
