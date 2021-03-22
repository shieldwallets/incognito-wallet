import React, { useState } from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useSelector, useDispatch } from 'react-redux';
import {
  loadAccountHistory,
  handleFilterHistoryReceiveByTokenId,
  loadTokenHistoryWithToken,
  getTypeHistoryReceive,
} from '@src/redux/utils/token';
import { getHistories } from '@services/api/pdefi';
import {
  getHistories as getProvideHistories,
  getUserPoolData,
  getPoolConfig,
  checkPNodeReward,
} from '@services/api/pool';
import { getReceiveHistoryByRPCWithOutError } from '@src/services/wallet/RpcClientService';
import { Toast } from '@src/components/core';
import withDefaultAccount from '@components/Hoc/withDefaultAccount';
import Share from 'react-native-share';
import { compose } from 'recompose';
import moment from 'moment';
import formatUtil from '@src/utils/format';
import { getTokenList } from '@services/api/token';
import tokenService from '@services/wallet/tokenService';
import accountService from '@src/services/wallet/accountService';
import { COINS, CONSTANT_COMMONS } from '@src/constants';
import { pTokens, internalTokens } from '@src/redux/selectors/token';
import { ConfirmedTx } from '@src/services/wallet/WalletService';
import { getpTokenHistory } from '@src/services/api/history';
import { accountSeleclor } from '@src/redux/selectors';
import _ from 'lodash';
import convert from '@utils/convert';
import BigNumber from 'bignumber.js';
import {
  checkWriteStoragePermission,
  exportAndSaveCSVFile,
} from './ExportCSV.utils';

const enhance = (WrappedComp) => (props) => {
  const { wallet } = props;
  const account = useSelector(accountSeleclor.defaultAccountSelector);
  const [dataFile, setDataFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const pTokensList = useSelector(pTokens);
  const internalTokensList = useSelector(internalTokens);
  const signPublicKeyEncode = useSelector(
    accountSeleclor.signPublicKeyEncodeSelector,
  );

  const getReceivedTransactionHistory = async () => {
    console.time('getReceivedTransactionHistory');
    try {
      const followedTokens = await accountService.getFollowingTokens(
        account,
        wallet,
      );
      const tokenFollowedIds = followedTokens.map((token) => token.id);
      const privacyFollowedTokens = [
        COINS.PRV,
        ...tokenFollowedIds.map(
          (tokenId) =>
            [...pTokensList, ...internalTokensList]?.find(
              (t) => t?.tokenId === tokenId,
            ) || null,
        ),
      ];

      let transactionHistories = [];
      for (const token of privacyFollowedTokens) {
        const LIMIT = 1000;
        let page = 0;
        let loop = true;
        while (loop) {
          const histories =
            (await getReceiveHistoryByRPCWithOutError({
              PaymentAddress: account?.paymentAddress,
              ReadonlyKey: account?.readonlyKey,
              Limit: LIMIT,
              Skip: page * LIMIT,
              TokenID: token?.tokenId || token?.id,
            })) || [];

          const historiesFilterByTokenId = handleFilterHistoryReceiveByTokenId({
            tokenId: token?.tokenId || token?.id,
            histories,
          });

          let data = await new Promise.all([
            ...historiesFilterByTokenId?.map(async (history) => {
              const txID = history?.txID;
              let type = getTypeHistoryReceive({
                account,
                serialNumbers: history?.serialNumbers,
              });
              const h = {
                ...history,
                id: txID,
                incognitoTxID: txID,
                type,
                pDecimals: token?.pDecimals,
                decimals: token?.decimals,
                symbol: token?.externalSymbol || token?.symbol,
                status: ConfirmedTx,
                isHistoryReceived: true,
              };
              return h;
            }),
          ]);
          data = data
            .filter(
              (history) =>
                history?.type === CONSTANT_COMMONS.HISTORY.TYPE.RECEIVE,
            )
            .filter((history) => !!history?.amount);

          if (histories && histories.length > 0) {
            transactionHistories = [...transactionHistories, ...data];
            if (histories.length < LIMIT) {
              loop = false;
            }
            page = page + 1;
          } else {
            loop = false;
          }
        }
      }
      return transactionHistories.map((item) => ({
        Date: formatUtil.formatDateTime(item.time, 'MM/DD/YYYY HH:mm:ss'),
        'Received Quantity': `${new BigNumber(item.amount || 0)
          .dividedBy(Math.pow(10, item.pDecimals || 9))
          .toFixed()}`,
        'Received Currency': item.symbol || '',
        'Send Quantity': '',
        'Send Currency': '',
        'Fee Amount': '',
        'Fee Currency': '',
        Tag:
          item.metaData && item.metaData.Type && CONSTANT_COMMONS.HISTORY.TYPE_HISTORY_RECEIVE[item.metaData.Type]
            ? CONSTANT_COMMONS.HISTORY.TYPE_HISTORY_RECEIVE[item.metaData.Type]
            : 'Receive',
        tx: item,
      }));
    } catch (error) {
      /*Ignore error*/
    } finally {
      console.timeEnd('getReceivedTransactionHistory');
    }
  };

  const getSendPRVTransactionHistory = async () => {
    console.time('getSendPRVTransactionHistory');
    try {
      let [prvHistories] = await new Promise.all([
        dispatch(loadAccountHistory()),
      ]);

      prvHistories =
        prvHistories && prvHistories.length > 0
          ? prvHistories.map((item) => ({
            Date: formatUtil.formatDateTime(item.time, 'MM/DD/YYYY HH:mm:ss'),
            'Received Quantity': '',
            'Received Currency': '',
            'Send Quantity': `${new BigNumber(item.amountNativeToken || 0)
              .dividedBy(Math.pow(10, COINS.PRV.pDecimals || 9))
              .toFixed() || ''}`,
            'Send Currency': COINS.PRV.symbol || '',
            'Fee Amount': `${new BigNumber(item.feeNativeToken || 0)
              .dividedBy(Math.pow(10, COINS.PRV.pDecimals || 9))
              .toFixed() || ''}`,
            'Fee Currency': COINS.PRV.symbol || '',
            Tag: 'Send',
          }))
          : [];
      return prvHistories || [];
    } catch (error) {
      /*Ignore error*/
    } finally {
      console.timeEnd('getSendPRVTransactionHistory');
    }
  };

  const getSendAnotherCoinTransactionHistory = async () => {
    console.time('getSendAnotherCoinTransactionHistory');
    try {
      const followedTokens = await accountService.getFollowingTokens(
        account,
        wallet,
      );
      const tokenFollowedIds = followedTokens.map((token) => token.id);
      const privacyFollowedTokens = tokenFollowedIds.map(
        (tokenId) =>
          [...pTokensList, ...internalTokensList]?.find(
            (t) => t?.tokenId === tokenId,
          ) || null,
      );

      let anotherHistories = [];
      for (const token of privacyFollowedTokens.map((token) => ({
        ...token,
        id: token.tokenId,
      }))) {
        let [histories] = await new Promise.all([
          dispatch(loadTokenHistoryWithToken(token)),
        ]);

        histories =
          histories &&
          histories.length > 0 &&
          histories.map((item) => {
            const sendQuantity =
              item.amountNativeToken && item.amountNativeToken !== '0'
                ? `${new BigNumber(item.amountNativeToken || 0)
                  .dividedBy(Math.pow(10, COINS.PRV.pDecimals))
                  .toFixed() || ''}`
                : `${new BigNumber(item.amountPToken || 0)
                  .dividedBy(Math.pow(10, token?.pDecimals || 9))
                  .toFixed() || ''}`;
            const feeAmount =
              item.feeNativeToken && item.feeNativeToken !== '0'
                ? `${new BigNumber(item.feeNativeToken || 0)
                  .dividedBy(Math.pow(10, COINS.PRV.pDecimals))
                  .toFixed() || ''}`
                : `${new BigNumber(item.feePToken || 0)
                  .dividedBy(Math.pow(10, token?.pDecimals || 9))
                  .toFixed() || ''}`;

            const sendCurrency =
              item.amountNativeToken && item.amountNativeToken !== '0'
                ? COINS.PRV.symbol
                : token?.symbol;
            const feeCurrency =
              item.feeNativeToken && item.feeNativeToken !== '0'
                ? COINS.PRV.symbol
                : token?.symbol;
            return {
              Date: formatUtil.formatDateTime(item.time, 'MM/DD/YYYY HH:mm:ss'),
              'Received Quantity': '',
              'Received Currency': '',
              'Send Quantity': sendQuantity,
              'Send Currency': sendCurrency || '',
              'Fee Amount': feeAmount,
              'Fee Currency': feeCurrency || '',
              Tag: 'Send',
            };
          });

        anotherHistories = [
          ...anotherHistories,
          ...(histories ? histories : []),
        ];
      }
      return anotherHistories;
    } catch (error) {
      /*Ignore error*/
    } finally {
      console.timeEnd('getSendAnotherCoinTransactionHistory');
    }
  };

  const getSendTransactionHistory = async () => {
    console.time('getSendTransactionHistory');
    try {
      const [prvHistories, anotherHistories] = await new Promise.all([
        getSendPRVTransactionHistory(),
        getSendAnotherCoinTransactionHistory(),
      ]);
      return [
        ...(prvHistories ? prvHistories : []),
        ...(anotherHistories ? anotherHistories : []),
      ];
    } catch (error) {
      /*Ignore error*/
    } finally {
      console.timeEnd('getSendTransactionHistory');
    }
  };

  const getTradeTransactionHistory = async () => {
    console.time('getTradeTransactionHistory');
    try {
      const LIMIT = 1000;
      let page = 1;
      let loop = true;
      let transactionHistories = [];

      const [pTokens, chainTokens] = await Promise.all([
        getTokenList(),
        tokenService.getPrivacyTokens(),
      ]);
      const tokens = tokenService.mergeTokens(chainTokens, pTokens);

      while (loop) {
        const newData = await getHistories([account], tokens, page, LIMIT);
        if (newData) {
          const newIds = newData.map((item) => item.id);
          const newTransactionHistories = _(
            newData.filter((item) => item.status === 'Successful'),
          )
            .concat(
              transactionHistories.filter((item) => !newIds.includes(item.id)),
            )
            .orderBy((item) => item.id, 'desc')
            .uniqBy((item) => item.id)
            .value();

          transactionHistories = newTransactionHistories;
          if (newData.length < LIMIT) {
            loop = false;
          }
          page = page + 1;
        } else {
          loop = false;
        }
      }
      return transactionHistories.map((item) => {
        const sendCurrency = new BigNumber(
          convert.toNumber(item.sellAmount || 0, true),
        ).toFixed();
        return {
          Date: moment(item.createdAt1).format('MM/DD/YYYY HH:mm:ss'),
          'Received Quantity':
            new BigNumber(
              convert.toNumber(item.amountReceive || 0, true),
            ).toFixed() || '',
          'Received Currency': item.buyTokenSymbol || '',
          'Send Quantity': isNaN(sendCurrency) ? '' : sendCurrency,
          'Send Currency': item.sellTokenSymbol || '',
          'Fee Amount':
            new BigNumber(convert.toNumber(item.networkFee || 0, true)).toFixed() ||
            '',
          'Fee Currency': item.networkFeeTokenSymbol || '',
          Tag: 'Trade V2',
        };
      });
    } catch (error) {
      /*Ignore error*/
    } finally {
      console.timeEnd('getTradeTransactionHistory');
    }
  };

  const getProvideTransactionHistory = async () => {
    console.time('getProvideTransactionHistory');
    try {
      const LIMIT = 1000;
      let page = 1;
      let loop = true;
      let histories = [];

      const config = await getPoolConfig();
      const userData = await getUserPoolData(
        account.PaymentAddress,
        config.coins,
      );

      while (loop) {
        const data = await getProvideHistories(account, page, LIMIT, userData);
        const { items } = data;
        if (items && items.length > 0) {
          histories = [
            ...histories,
            ...items.filter((item) => item.status === 'Successful'),
          ];
          if (items.length < LIMIT) {
            loop = false;
          }
          page = page + 1;
        } else {
          loop = false;
        }
      }
      return histories.map((item) => {
        const formatted = {
          Date: moment(item.time1).format('MM/DD/YYYY HH:mm:ss'),
          'Received Quantity': `${new BigNumber(item.amount || 0)
            .dividedBy(Math.pow(10, item.coin.pDecimals || 9))
            .toFixed() || ''}`,
          'Received Currency': item.coin.symbol || '',
          'Send Quantity': '',
          'Send Currency': '',
          'Fee Amount': '',
          'Fee Currency': '',
          Tag:
            item.type === 'Withdraw reward'
              ? 'Withdraw reward (Provide)'
              : item.type,
        };

        if (item.type === 'Provide') {
          formatted['Send Quantity'] = formatted['Received Quantity'];
          formatted['Send Currency'] = formatted['Received Currency'];
          formatted['Fee Amount'] = formatUtil.amountFull(100, COINS.PRV.pDecimals);
          formatted['Fee Currency'] = 'PRV';

          formatted['Received Currency'] = '';
          formatted['Received Quantity'] = '';
        }

        return formatted;
      });
    } catch (error) {
      /*Ignore error*/
    } finally {
      console.timeEnd('getProvideTransactionHistory');
    }
  };

  const getShieldAndUnShieldTransactionHistory = async () => {
    console.time('getShieldAndUnShieldTransactionHistory');
    try {
      const { paymentAddress } = account;

      if (paymentAddress && signPublicKeyEncode) {
        const followedTokens = await accountService.getFollowingTokens(
          account,
          wallet,
        );
        const tokenFollowedIds = followedTokens.map((token) => token.id);
        const privacyFollowedTokens = [
          COINS.PRV,
          ...tokenFollowedIds.map(
            (tokenId) =>
              [...pTokensList, ...internalTokensList]?.find(
                (t) => t?.tokenId === tokenId,
              ) || null,
          ),
        ];

        let histories = [];
        for (const token of privacyFollowedTokens) {
          const data = await getpTokenHistory({
            paymentAddress,
            tokenId: token.tokenId || token.id,
            signPublicKeyEncode,
          });
          if (data && data.length > 0) {
            const newData = data
              .filter((item) => item.statusText === 'SUCCESS')
              .map((item) => ({
                Date: formatUtil.formatDateTime(
                  item.createdAt,
                  'MM/DD/YYYY HH:mm:ss',
                ),
                'Received Quantity': `${new BigNumber(item.incognitoAmount || 0)
                  .dividedBy(Math.pow(10, COINS.PRV.pDecimals))
                  .toFixed() || ''}`,
                'Received Currency': token?.externalSymbol || token?.symbol,
                'Send Quantity': '',
                'Send Currency': '',
                'Fee Amount': '',
                'Fee Currency': '',
                Tag: item.isShieldTx ? 'Shield' : 'Unshield',
              }));
            histories = [...histories, ...newData];
          }
        }
        return histories;
      }
    } catch (error) {
      /*Ignore error*/
    } finally {
      console.timeEnd('getShieldAndUnShieldTransactionHistory');
    }
  };

  const getpNodeTransactionHistory = async (userHistories) => {
    console.time('getpNodeTransactionHistory');
    try {
      const userHashIds = userHistories.map((item) => item.txID);
      const data = await checkPNodeReward(userHashIds);

      const token = COINS.PRV;
      let pNodeHistories = [];
      if (data && data.length > 0) {
        pNodeHistories = userHistories.filter((history) =>
          data.includes(history.Hash),
        );
        pNodeHistories = handleFilterHistoryReceiveByTokenId({
          tokenId: token?.tokenId || token?.id,
          histories: pNodeHistories,
        });
      }
      return pNodeHistories.map((item) => ({
        Date: formatUtil.formatDateTime(item.time, 'MM/DD/YYYY HH:mm:ss'),
        'Received Quantity': `${new BigNumber(item.amount || 0)
          .dividedBy(Math.pow(10, token.pDecimals || 9))
          .toFixed() || ''}`,
        'Received Currency': token.symbol || '',
        'Send Quantity': '',
        'Send Currency': '',
        'Fee Amount': '',
        'Fee Currency': '',
        Tag: 'Withdraw reward (pNode)',
      }));
    } catch (error) {
      /*Ignore error*/
    } finally {
      console.timeEnd('getpNodeTransactionHistory');
    }
  };

  const shareFile = (path) => {
    setTimeout(() => {
      Share.open({
        url: path,
        title: 'Export balance changes of the current keychain',
      });
    }, 300);
  };

  const exportCSV = async () => {
    console.time('exportCSV');
    if (dataFile) {
      return shareFile(dataFile);
    }

    try {
      const canWrite = await checkWriteStoragePermission();
      if (canWrite) {
        setLoading(true);

        const [
          [receive, pNode],
          provide,
          shield,
          trade,
          send,
        ] = await new Promise.all([
          getReceivedTransactionHistory().then(histories => {
            const prvTxs = histories.filter(history => history.tx.tokenId === COINS.PRV_ID)
              .map(item => item.tx);

            return Promise.all([
              getpNodeTransactionHistory(prvTxs),
              Promise.resolve(histories)
            ]);
          }),
          getProvideTransactionHistory(),
          getShieldAndUnShieldTransactionHistory(),
          getTradeTransactionHistory(),
          getSendTransactionHistory(),
        ]);

        const mergedData = [
          ...(send ? send : []),
          ...(receive ? receive : []),
          ...(provide ? provide : []),
          ...(shield ? shield : []),
          ...(trade ? trade : []),
          ...(pNode ? pNode : []),
        ].sort(
          (a, b) =>
            moment(a.Date, [
              'MM/DD/YYYY hh:mm:ss',
              'MM/DD/YYYY HH:mm:SS',
              'MM/DD/YYYY HH:MM:SS',
            ]).unix() -
            moment(b.Date, [
              'MM/DD/YYYY hh:mm:ss',
              'MM/DD/YYYY HH:mm:SS',
              'MM/DD/YYYY HH:MM:SS',
            ]).unix(),
        ).map(item => ({
          Date: item.Date,
          'Received Quantity': item['Received Quantity'],
          'Received Currency': item['Received Currency'],
          'Send Quantity': item['Send Quantity'],
          'Send Currency': item['Send Currency'],
          'Fee Amount': item['Fee Amount'],
          'Fee Currency': item['Fee Currency'],
          Tag: item.Tag,
        }));

        if (mergedData && mergedData.length > 0) {
          console.time('exportAndSaveCSVFile');
          const path = await exportAndSaveCSVFile(mergedData);
          console.timeEnd('exportAndSaveCSVFile');
          setDataFile(path);
          shareFile(path);
        } else {
          Toast.showWarning(
            'Your account does not have any transaction history.',
          );
        }
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
      console.timeEnd('exportCSV');
    }
  };

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          loadingExportCSV: loading,
          exportCSV,
          dataFile,
        }}
      />
    </ErrorBoundary>
  );
};

export default compose(
  withDefaultAccount,
  enhance,
);
