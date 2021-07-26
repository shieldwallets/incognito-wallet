import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {TRANSACTION_FEE} from '@screens/Dex/Liquidity.constants';
import {MESSAGES, PRV_ID} from '@screens/Dex/constants';

const withValidate = WrappedComp => props => {
  const {
    showRetry,
    showRefund,
    refundTokenBalance,
    retryTokenBalance,
    prvBalance,

    retryTokenID,
    refundTokenID,
    retryAmount,
  } = props;

  const [error, setError] = React.useState('');

  const handleValidate = () => {
    if (prvBalance < TRANSACTION_FEE) {
      setError(MESSAGES.NOT_ENOUGH_PRV_NETWORK_FEE);
    }
    if (showRetry && retryTokenID === PRV_ID && retryTokenBalance < TRANSACTION_FEE + retryAmount) {
      setError(MESSAGES.BALANCE_INSUFFICIENT);
    }
    if (showRetry && retryTokenID === PRV_ID && retryTokenBalance < retryAmount) {
      setError(MESSAGES.BALANCE_INSUFFICIENT);
    }
  };

  React.useEffect(() => {
    if (!refundTokenID || !retryTokenID) return;
    handleValidate();
  }, [
    showRetry,
    showRefund,
    refundTokenBalance,
    retryTokenBalance,
    prvBalance,
    retryAmount,
    retryTokenID,
    refundTokenID,
  ]);

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          error,
        }}
      />
    </ErrorBoundary>
  );
};

export default withValidate;
