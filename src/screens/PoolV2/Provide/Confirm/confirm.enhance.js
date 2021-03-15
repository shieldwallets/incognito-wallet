import React from 'react';
import { ExHandler } from '@services/exception';
import accountService from '@services/wallet/accountService';
import { provide } from '@services/api/pool';
import { getSignPublicKey } from '@services/gomobile';
import LocalDatabase from '@utils/LocalDatabase';
import { useSelector } from 'react-redux';
import { selectedPrivacySeleclor } from '@src/redux/selectors';
import { logEvent, Events } from '@services/firebase';
import convert from '@utils/convert';

const withConfirm = WrappedComp => (props) => {
  const [error, setError] = React.useState('');
  const [providing, setProviding] = React.useState(false);
  const {
    value,
    coin,
    fee,
    onSuccess,
    wallet,
    account,
    isPrv,
    originProvide,
  } = props;

  const Token = useSelector(
    selectedPrivacySeleclor.getPrivacyDataByTokenID,
  )(coin.id);

  const confirm = async () => {
    if (providing) {
      return;
    }

    setProviding(true);
    setError('');

    try {
      let provideValue = isPrv ? originProvide : value;
      let providerFee  = fee;

      /**
      *  Log event when user provide 
      */
      logEvent(Events.provide_coin, {
        name: coin.name || '',
        ticker: coin.symbol || '',
        amount: convert.toNumber(provideValue, true) / Math.pow(10, coin.pDecimals || 9),
        amountUsd: Token.priceUsd ? (convert.toNumber(provideValue, true) / Math.pow(10, coin.pDecimals || 9))*Token.priceUsd : null,
      });

      const signPublicKeyEncode = await getSignPublicKey(account.PrivateKey);
      const txs = await LocalDatabase.getProvideTxs();

      const txHandler = async (txHash) => {
        txs.push({
          paymentAddress: account.PaymentAddress,
          txId: txHash,
          signPublicKeyEncode,
          provideValue,
          value: provideValue,
          time: new Date().getTime(),
        });
        await LocalDatabase.saveProvideTxs(txs);
      };

      const result = await accountService.createAndSendToken(
        account,
        wallet,
        coin.masterAddress,
        provideValue,
        coin.id,
        providerFee,
        0,
        0,
        '',
        txHandler,
      );
      if (!global.isDEV && result && result.txId) {
        await provide(account.PaymentAddress, result.txId, signPublicKeyEncode, provideValue);
        txs.splice(txs.length - 1, 1);
        await LocalDatabase.saveProvideTxs(txs);
        onSuccess(true);
      }
    } catch (error) {
      setError(new ExHandler(error).getMessage());
    } finally {
      setProviding(false);
    }
  };

  return (
    <WrappedComp
      {...{
        ...props,
        providing,
        onConfirm: confirm,
        error,
      }}
    />
  );
};

export default withConfirm;
