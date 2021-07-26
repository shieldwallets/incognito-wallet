import React from 'react';
import PropTypes from 'prop-types';
import formatUtil from '@utils/format';
import ExtraInfo from '@screens/DexV2/components/ExtraInfo';

const PoolSize = (props) => {
  const {
    inputToken,
    outputToken,
    pair,
  } = props;

  if (!inputToken || !outputToken || !pair) {
    return null;
  }

  const inputPool = pair && inputToken ? pair[inputToken.id] : 0;
  const outputPool = pair && outputToken ? pair[outputToken.id] : 0;

  const formattedInputPool = formatUtil.amount(inputPool, inputToken.pDecimals);
  const formattedOutputPool = formatUtil.amount(outputPool, outputToken.pDecimals);
  return (
    <ExtraInfo
      left="Pool size"
      right={`${formattedInputPool} ${inputToken?.symbol} + ${formattedOutputPool} ${outputToken?.symbol}`}
      numberOfLines={2}
    />
  );
};

PoolSize.propTypes = {
  inputToken: PropTypes.object.isRequired,
  outputToken: PropTypes.object.isRequired,
  pair: PropTypes.object.isRequired,
};

export default PoolSize;
