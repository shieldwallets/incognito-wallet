import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';

export const enhanceData = WrappedComp => props => {
  const { account } = props;

  const paymentAddress = React.useMemo(() => account?.PaymentAddress || '', [account]);

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,

          paymentAddress,
        }}
      />
    </ErrorBoundary>
  );
};