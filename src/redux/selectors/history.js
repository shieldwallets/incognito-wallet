import orderBy from 'lodash/orderBy';
import {
  Validator,
  ACCOUNT_CONSTANT,
} from 'incognito-chain-web-js/build/wallet';
import { createSelector } from 'reselect';
import formatUtil from '@src/utils/format';
import { decimalDigitsSelector } from '@src/screens/Setting';
import LinkingService from '@src/services/linking';
import {
  getStatusColorShield,
  getStatusColorUnshield,
  TX_STATUS_COLOR,
} from '@src/redux/utils/history';
import { PRV } from '@src/constants/common';
import { CONSTANT_CONFIGS } from '@src/constants';
import { selectedPrivacy } from './selectedPrivacy';

const renderAmount = ({ amount, pDecimals, decimalDigits } = {}) => {
  let amountStr = '';
  try {
    new Validator('amount', amount).amount();
    new Validator('pDecimals', pDecimals).number();
    new Validator('decimalDigits', decimalDigits).boolean();
    const amountToNumber = Number(amount) || 0;
    if (amountToNumber) {
      amountStr = formatUtil.amount(amount, pDecimals, true, decimalDigits);
    }
  } catch (error) {
    console.log('renderAmount', error);
  }
  return amountStr;
};

export const historySelector = createSelector(
  (state) => state.history,
  (history) => history,
);

// txs transactor

export const mappingTxTransactorSelector = createSelector(
  selectedPrivacy,
  decimalDigitsSelector,
  (selectedPrivacy, decimalDigits) => (txt) => {
    new Validator('txt', txt).required().object();
    const { pDecimals } = selectedPrivacy;
    let { time, amount, fee, status } = txt;
    const timeStr = formatUtil.formatDateTime(time);
    const amountStr = renderAmount({
      amount,
      pDecimals,
      decimalDigits,
    });
    const result = {
      ...txt,
      feeStr: renderAmount({
        amount: fee,
        pDecimals: PRV.pDecimals,
        decimalDigits: false,
      }),
      amountStr,
      timeStr,
      statusColor: TX_STATUS_COLOR[status],
    };
    return result;
  },
);

export const historyTransactorSelector = createSelector(
  historySelector,
  mappingTxTransactorSelector,
  ({ txsTransactor }, mappingTxt) =>
    txsTransactor.map((txt) => mappingTxt(txt)),
);

// txs receiver

export const mappingTxReceiverSelector = createSelector(
  selectedPrivacy,
  decimalDigitsSelector,
  ({ pDecimals }, decimalDigits) => (txr) => {
    const result = {
      ...txr,
      timeStr: formatUtil.formatDateTime(txr?.time),
      amountStr: renderAmount({
        amount: txr?.amount,
        pDecimals,
        decimalDigits,
      }),
      statusColor: TX_STATUS_COLOR[(txr?.status)],
    };
    return result;
  },
);

export const historyReceiverSelector = createSelector(
  historySelector,
  mappingTxReceiverSelector,
  ({ txsReceiver }, mappingTxr) => txsReceiver.map((txr) => mappingTxr(txr)),
);

// txs ptoken

export const mappingTxPTokenSelector = createSelector(
  selectedPrivacy,
  decimalDigitsSelector,
  ({ pDecimals, symbol }, decimalDigits) => (txp) => {
    const {
      status,
      currencyType,
      time,
      incognitoAmount,
      statusMessage,
      isShieldTx,
      decentralized,
      expiredAt,
      statusDetail,
      isExpiredShieldCentralized,
      isShielding,
    } = txp;
    const shouldRenderQrShieldingAddress =
      isShieldTx &&
      (isShielding ||
        isExpiredShieldCentralized ||
        (status === 17 && currencyType !== 1 && currencyType !== 3));
    const expiredAtStr = decentralized
      ? ''
      : formatUtil.formatDateTime(expiredAt);
    const statusColor = isShieldTx
      ? getStatusColorShield(txp)
      : getStatusColorUnshield(txp);
    const showStatusDetail = !!statusDetail;
    const result = {
      ...txp,
      timeStr: formatUtil.formatDateTime(time),
      amountStr: renderAmount({
        amount: incognitoAmount,
        pDecimals,
        decimalDigits,
      }),
      statusStr: statusMessage,
      symbol,
      shouldRenderQrShieldingAddress,
      isShielding,
      expiredAtStr,
      statusColor,
      showStatusDetail,
    };
    return result;
  },
);

export const historyPTokenSelector = createSelector(
  historySelector,
  mappingTxPTokenSelector,
  (history, mappingTxPToken) =>
    history.txsPToken.map((txp) => mappingTxPToken(txp)),
);

export const historyTxsSelector = createSelector(
  historySelector,
  historyTransactorSelector,
  historyReceiverSelector,
  historyPTokenSelector,
  (history, txsTransactor, txsReceiver, txsPToken) => {
    const { isFetching, isFetched } = history;
    const histories = [...txsTransactor, ...txsReceiver, ...txsPToken] || [];
    const sort = orderBy(histories, 'time', 'desc');
    return {
      ...history,
      isEmpty: histories.length === 0 && !isFetching && isFetched,
      refreshing: isFetching,
      oversize: true,
      histories: [...sort],
    };
  },
);

export const historyDetailSelector = createSelector(
  historySelector,
  ({ detail }) => detail,
);

export const historyDetailFactoriesSelector = createSelector(
  historyDetailSelector,
  selectedPrivacy,
  ({ tx }, selectedPrivacy) => {
    const { txType } = tx;
    try {
      switch (txType) {
      case ACCOUNT_CONSTANT.TX_TYPE.RECEIVE: {
        const {
          txId,
          statusColor,
          amount,
          time,
          timeStr,
          status,
          statusStr,
          txTypeStr,
        } = tx;
        return [
          {
            label: 'TxID',
            value: `#${txId}`,
            copyable: true,
            openUrl: !!txId,
            handleOpenUrl: () =>
              LinkingService.openUrl(
                `${CONSTANT_CONFIGS.EXPLORER_CONSTANT_CHAIN_URL}/tx/${txId}`,
              ),
            disabled: !txId,
          },
          {
            label: 'Receive',
            value: `${tx?.amountStr} ${selectedPrivacy.symbol}`,
            disabled: !amount,
          },
          {
            label: 'Status',
            value: statusStr,
            valueTextStyle: { color: statusColor },
            disabled: !status,
          },
          {
            label: 'Time',
            value: timeStr,
            disabled: !time,
          },
          {
            label: 'Type',
            value: txTypeStr,
            disabled: !txTypeStr,
          },
        ];
      }
      case ACCOUNT_CONSTANT.TX_TYPE.SHIELD: {
        const {
          id,
          statusStr,
          timeStr,
          amountStr,
          symbol,
          inChainTx,
          expiredAtStr,
          userPaymentAddress,
          statusColor,
          isShielding,
          statusDetail,
          showStatusDetail,
          erc20TokenAddress,
        } = tx;
        return [
          {
            label: 'ID',
            value: `#${id}`,
            copyable: true,
            disabled: !id,
          },
          {
            label: 'Shield',
            value: `${amountStr} ${symbol}`,
            disabled: !amountStr,
          },
          {
            label: 'Status',
            value: statusStr,
            disabled: !statusStr,
            valueTextStyle: { color: statusColor },
            statusDetail,
            showStatusDetail,
          },
          {
            label: 'Time',
            value: timeStr,
            disabled: !timeStr,
          },
          {
            label: 'Expired at',
            value: expiredAtStr,
            disabled: !expiredAtStr || !isShielding,
          },
          {
            label: 'To address',
            value: userPaymentAddress,
            disabled: !userPaymentAddress,
          },
          {
            label: 'Inchain TxID',
            value: inChainTx,
            disabled: !inChainTx,
            openUrl: !!inChainTx,
            handleOpenUrl: () => LinkingService.openUrl(inChainTx),
          },
          {
            label: 'Contract',
            valueText: erc20TokenAddress,
            copyable: true,
            disabled: !erc20TokenAddress,
          },
        ];
      }
      default: {
        const {
          fee,
          receiverAddress,
          memo,
          txTypeStr,
          txId,
          statusColor,
          amount,
          time,
          timeStr,
          status,
          statusStr,
        } = tx;
        return [
          {
            label: 'TxID',
            value: `#${txId}`,
            copyable: true,
            openUrl: !!txId,
            handleOpenUrl: () =>
              LinkingService.openUrl(
                `${CONSTANT_CONFIGS.EXPLORER_CONSTANT_CHAIN_URL}/tx/${txId}`,
              ),
            disabled: !txId,
          },
          {
            label: 'Send',
            value: `${tx?.amountStr} ${selectedPrivacy.symbol}`,
            disabled: !amount,
          },
          {
            label: 'Fee',
            value: `${tx?.feeStr} ${PRV.symbol}`,
            disabled: !fee,
          },
          {
            label: 'Status',
            value: statusStr,
            valueTextStyle: { color: statusColor },
            disabled: !status,
          },
          {
            label: 'Time',
            value: timeStr,
            disabled: !time,
          },
          {
            label: 'To address',
            value: receiverAddress,
            disabled: !receiverAddress,
            copyable: true,
          },
          {
            label: 'Memo',
            value: memo,
            disabled: !memo,
            copyable: true,
            fullText: true,
          },
          {
            label: 'Type',
            value: txTypeStr,
            disabled: !txTypeStr,
          },
        ];
      }
      }
    } catch (error) {
      console.log(error);
    }
    return [];
  },
);
