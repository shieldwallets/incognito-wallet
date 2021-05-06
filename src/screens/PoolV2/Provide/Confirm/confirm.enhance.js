import React from 'react';
import { ExHandler } from '@services/exception';
import accountService from '@services/wallet/accountService';
import { provide } from '@services/api/pool';
import LocalDatabase from '@utils/LocalDatabase';
import { useSelector } from 'react-redux';
import { accountSeleclor } from '@src/redux/selectors';
import ReCaptchaV3 from '@haskkor/react-native-recaptchav3';
import appConstant from '@src/constants/app';

const withConfirm = WrappedComp => (props) => {
  const signPublicKeyEncode = useSelector(accountSeleclor.signPublicKeyEncodeSelector);
  const [error, setError] = React.useState('');
  const [providing, setProviding] = React.useState(false);
  const [sendTx, setSendTx] = React.useState(null);
  const [disable, setDisable] = React.useState(true);
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
      setDisable(false);
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
    try {
      if (sendTx) return;
      let provideValue = isPrv ? originProvide : value;
      let providerFee  = fee;
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
        setTimeout(() => {
          captchaRef.current?.refreshToken();
        }, 1000);
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
        captchaDomain={appConstant.CAPTCHA_DOMAIN}
        siteKey={appConstant.CAPTCHA_KEY}
        onReceiveToken={handleProvideApi}
      />
      <WrappedComp
        {...{
          ...props,
          providing,
          onConfirm: onConfirmPress,
          error,
          disable,
        }}
      />
    </>
  );
};

export default withConfirm;
