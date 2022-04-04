import ErrorBoundary from '@src/components/ErrorBoundary';
import { getDefaultAccountWalletSelector } from '@src/redux/selectors/shared';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectedPrivacySelector } from '@src/redux/selectors';
import { PrivacyVersion } from 'incognito-chain-web-js/build/wallet';
import formatUtil from '@utils/format';
import { renderNoClipAmount } from '@src/redux/selectors/history';
import { COINS } from '@src/constants';
import flatten from 'lodash/flatten';

const withExportCSVVer1 = (WrappedComp) => (props) => {
  const [loading, setLoading] = useState(false);
  const [forcePercent, setForcePercent] = useState(0);
  const [disableBtn, setDisableBtn] = useState(true);
  const accountWallet = useSelector(getDefaultAccountWalletSelector);
  const counterSuccess = useRef(0);
  const selectedPrivacyWithTokenIDFn = useSelector(
    selectedPrivacySelector.getPrivacyDataByTokenID,
  );

  const tokenIDsVer1 = useRef(0);
  const tokenIDsVer2 = useRef(0);

  const formatSendItems = (items, token) => {
    const results =
      (items &&
        items.length > 0 &&
        items.reduce((currentResult, item) => {
          const { amount = 0, time = 0, fee = 0, txTypeStr = '' } = item;
          if (item.statusStr === 'Success') {
            const data = {
              Date: formatUtil.formatDateTime(time, 'MM/DD/YYYY HH:mm:ss'),
              'Received Quantity': '',
              'Received Currency': '',
              'Send Quantity': `${renderNoClipAmount({
                amount: amount || 0,
                pDecimals: token.pDecimals || 9,
              })}`,
              'Send Currency': token.symbol || token.externalSymbol || '',
              'Fee Amount': `${renderNoClipAmount({
                amount: fee || 0,
                pDecimals: COINS.PRV.pDecimals || 9,
              })}`,
              'Fee Currency': COINS.PRV.symbol || '',
              Tag: 'Send',
              TxType: txTypeStr,
            };
            currentResult.push(data);
          }
          return currentResult;
        }, [])) ||
      [];
    return results;
  };

  const formatReceiveItems = (items, token) => {
    const results =
      (items &&
        items.length > 0 &&
        items.reduce((currentResult, item) => {
          const { amount = 0, time = 0, txTypeStr = '' } = item;
          if (item.statusStr === 'Success') {
            const data = {
              Date: formatUtil.formatDateTime(time, 'MM/DD/YYYY HH:mm:ss'),
              'Received Quantity': `${renderNoClipAmount({
                amount: amount || 0,
                pDecimals: token.pDecimals || 9,
              })}`,
              'Received Currency': token.symbol || token.externalSymbol || '',
              'Send Quantity': '',
              'Send Currency': '',
              'Fee Amount': '',
              'Fee Currency': '',
              Tag: 'Receive',
              TxType: txTypeStr,
            };
            currentResult.push(data);
          }
          return currentResult;
        }, [])) ||
      [];
    return results;
  };

  const getHistoryWithToken = async (tokenID) => {
    const tokenSelected = selectedPrivacyWithTokenIDFn(tokenID);
    const data = await accountWallet.getTxsHistory({
      tokenID,
      isPToken: tokenSelected.isPToken,
      version: PrivacyVersion.ver1,
    });
    let { txsReceiver = [], txsTransactor = [] } = data;
    txsTransactor = txsTransactor.filter(
      ({ txTypeStr }) => !txTypeStr.includes('Convert'),
    );
    const sendFormated = formatSendItems(txsTransactor, tokenSelected);
    const receiveFormated = formatReceiveItems(txsReceiver, tokenSelected);
    counterSuccess.current = counterSuccess.current + 1;
    setForcePercent(() =>
      Math.round(
        (counterSuccess.current / (tokenIDsVer2.length + tokenIDsVer1.length)) *
          100,
      ),
    );
    return [...sendFormated, ...receiveFormated];
  };

  const getTxsHistoryCoinsVer1 = async () => {
    const dataList = await Promise.all(
      tokenIDsVer1.current.map(
        async (tokenId) => await getHistoryWithToken(tokenId),
      ),
    );
    return flatten(dataList || []);
  };

  const getKeyInfoCoinsV1 = async () => {
    let keysInfo = (await accountWallet.getKeyInfoV1()) || [];
    tokenIDsVer1.current = keysInfo.map(({ tokenID }) => tokenID);
  };

  const getKeyInfoCoinsV2 = async () => {
    const keyInfo = await accountWallet.getKeyInfo({
      version: PrivacyVersion.ver2,
    });
    const tokenIdsList = [...Object.keys(keyInfo.coinindex || {})];
    tokenIDsVer2.current = tokenIdsList;
  };

  const getKeyInfo = async () => {
    setDisableBtn(true);
    await Promise.all([getKeyInfoCoinsV1(), getKeyInfoCoinsV2()]);
    setDisableBtn(false);
  };

  useEffect(() => {
    getKeyInfo();
  }, []);

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          counterSuccess,
          getTxsHistoryCoinsVer1,
          loading,
          setLoading,
          forcePercent,
          setForcePercent,
          tokenIDsVer2,
          tokenIDsVer1,
          disableBtn,
        }}
      />
    </ErrorBoundary>
  );
};

export default withExportCSVVer1;