import React from 'react';
import { COINS } from '@src/constants';
import { MAX_DEX_FEE, MAX_FEE_PER_TX } from '@components/EstimateFee/EstimateFee.utils';

const withEstimateFee = WrappedComp => (props) => {
  const [fee, setFee] = React.useState(MAX_DEX_FEE);
  const [feeToken, setFeeToken] = React.useState(COINS.PRV);

  const { inputToken, outputToken } = props;

  const estimateFee = () => {
    if (inputToken.id !== COINS.PRV_ID && outputToken?.id !== COINS.PRV_ID) {
      setFee(MAX_DEX_FEE);
      setFeeToken(COINS.PRV);
      return;
    }

    if (inputToken.id !== COINS.PRV_ID) {
      setFeeToken(inputToken);
    } else {
      setFeeToken(COINS.PRV);
    }
    setFee(MAX_FEE_PER_TX);
  };

  const inputFee = feeToken?.id === inputToken.id ? fee : 0;
  const prvFee = feeToken?.id === COINS.PRV_ID ? fee : 0;

  React.useEffect(() => {
    if (inputToken && outputToken) {
      estimateFee();
    }
  }, [inputToken, outputToken]);

  return (
    <WrappedComp
      {...{
        ...props,
        fee,
        feeToken,
        inputFee,
        prvFee,
      }}
    />
  );
};

export default withEstimateFee;
