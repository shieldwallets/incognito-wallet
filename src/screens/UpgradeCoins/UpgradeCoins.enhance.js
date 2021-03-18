import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { compose } from 'recompose';
import { defaultAccountNameSelector } from '@src/redux/selectors/account';
import { walletSelector } from '@src/redux/selectors/wallet';
import { ExHandler } from '@services/exception';

const enhance = WrappedComp => props => {
  const accountName = useSelector(defaultAccountNameSelector);
  const wallet = useSelector(walletSelector);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const onLearnMore = useCallback(() => {

  }, []);

  const onConvert = useCallback(async () => {
    try {
      setProcessing(true);
      setError('');
      const account = wallet.getAccountByName(accountName);
      await account.convertAllCoins();
      setSuccess(true);
    } catch (e) {
      setError(new ExHandler(e).getMessage());
    } finally {
      setProcessing(false);
    }
  }, []);

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          onConvert,
          onLearnMore,
          processing,
          error,
        }}
      />
    </ErrorBoundary>
  );
};

export default compose(
  enhance,
);
