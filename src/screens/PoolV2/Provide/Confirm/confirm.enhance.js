import React from 'react';
import { ExHandler } from '@services/exception';
import accountService from '@services/wallet/accountService';
import { provide } from '@services/api/pool';
import { getSignPublicKey } from '@services/gomobile';
import LocalDatabase from '@utils/LocalDatabase';
import { useSelector } from 'react-redux';
import { accountSeleclor } from '@src/redux/selectors';
import ReCaptchaV3 from '@haskkor/react-native-recaptchav3';

const CAPTCHA_KEY = '6LeZpsUaAAAAAChIj86fhwS5fa1krkQ4QPEkcQv9';

const withConfirm = WrappedComp => (props) => {
  const [error, setError] = React.useState('');
  const [providing, setProviding] = React.useState(false);
  const [sendTx, setSendTx] = React.useState(null);
  const signPublicKeyEncode = useSelector(accountSeleclor.signPublicKeyEncodeSelector);
  const captchaRef = React.useRef(null);
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

  const handleProvideApi = async (verifyCode) => {
    try {
      if (!sendTx) return;
      const { txHistory, txInfo, provideValue } = sendTx;
      if (!global.isDEV && txInfo && txInfo.txId) {
        await provide(account.PaymentAddress, txInfo.txId, signPublicKeyEncode, provideValue, verifyCode);
        txHistory.splice(txHistory.length - 1, 1);
        await LocalDatabase.saveProvideTxs(txHistory);
        onSuccess(true);
      }
    } catch (e) {
      setError(new ExHandler(e).getMessage());
    } finally {
      setProviding(false);
    }
  };

  const handleSendTransaction = async () => {
    if (sendTx) return;
    try {
      let provideValue = isPrv ? originProvide : value;
      let providerFee  = fee;

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
      setSendTx({ txHistory: txs, txInfo: result, provideValue });
      if (captchaRef.current) {
        captchaRef.current?.refreshToken();
      }
    } catch (e) {
      setSendTx(null);
      setProviding(false);
      setError(new ExHandler(e).getMessage());
    }
  };

  const onConfirmPress = () => {
    if (providing || !captchaRef.current) return;
    setProviding(true);
    handleSendTransaction().then();
  };

  return (
    <>
      <ReCaptchaV3
        ref={captchaRef}
        captchaDomain="https://incognito.org"
        siteKey={CAPTCHA_KEY}
        onReceiveToken={handleProvideApi}
      />
      <WrappedComp
        {...{
          ...props,
          providing,
          onConfirm: onConfirmPress,
          error,
        }}
      />
    </>
  );
};

export default withConfirm;
