import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {TRANSACTION_FEE} from '@screens/Dex/Liquidity.constants';
import {MESSAGES} from '@screens/Dex/constants';

const withValidate = WrappedComp => props => {
  const {
    canRetry,
    prvBalance,
    pTokenBalance,
    retryTokenId,
    retryAmount,
    isRetryPRV,
    contributes
  } = props;

  const [error, setError] = React.useState('');
  const [showRetry, setShowRetry] = React.useState(true);

  const handleValidate = () => {
    setError('');
    if (prvBalance < TRANSACTION_FEE) {
      setError(MESSAGES.NOT_ENOUGH_PRV_NETWORK_FEE);
      setShowRetry(false);
    }

    if (isRetryPRV) {
      if (retryAmount > prvBalance + TRANSACTION_FEE) {
        setShowRetry(false);
      }
    } else {
      if (pTokenBalance && pTokenBalance < retryAmount) {
        setError(MESSAGES.BALANCE_INSUFFICIENT);
        setShowRetry(false);
      }
    }
    if (contributes.length === 1) {
      setShowRetry(false);
    }
  };

  React.useEffect(() => {
    if (!canRetry) return;
    handleValidate();
  }, [canRetry, prvBalance, pTokenBalance, retryAmount, retryTokenId, retryAmount, isRetryPRV, contributes]);

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          error,
          showRetry
        }}
      />
    </ErrorBoundary>
  );
};

export default withValidate;
