import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { View, Text, RoundCornerButton } from '@components/core';
import { withLayout_2 } from '@components/Layout';
import Header from '@components/Header/index';
import ExtraInfo from '@screens/DexV2/components/ExtraInfo';
import CopiableText from '@components/CopiableText/CopiableText';
import { useDispatch } from 'react-redux';
import { deleteHistory, updateHistorySuccess } from '@src/redux/actions/dex';
import { useNavigation } from 'react-navigation-hooks';
import { CONSTANT_CONFIGS } from '@src/constants';
import axios from 'axios';
import withData from './data.enhance';
import styles from './style';
import formatUtil from '@utils/format';

const HistoryDetail = ({
  history,
  tokens,
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [gettingAmount, setGettingAmount] = useState(false);

  const removeHistory = () => {
    dispatch(deleteHistory(history));
    navigation.goBack();
  };

  const saveHistory = () => {
    // console.debug('SAVE HISTORY', history);
    dispatch(updateHistorySuccess(history));
  };

  const getActualAmount = async () => {
    try {
      setGettingAmount(true);
      const txRes = await axios.post(CONSTANT_CONFIGS.MAINNET_FULLNODE, {
        'jsonrpc': '1.0',
        'method': 'gettransactionbyhash',
        'params': [history.txId],
        'id': 1
      });

      const txData = txRes.data.Result;
      const startBlockHeight = txData.BlockHeight;
      let blockHash = txData.BlockHash;
      let receiveTx;

      console.debug('START BLOCK HEIGHT', startBlockHeight);

      while (!receiveTx) {
        const blockRes = await axios.post(CONSTANT_CONFIGS.MAINNET_FULLNODE, {
          'jsonrpc': '1.0',
          'method': 'retrieveblock',
          'params': [blockHash, '2'],
          'id': 1
        });
        const blockData = blockRes.data.Result;

        for (const tx of blockData.Txs) {
          const txId = tx.Hash;
          const txRes = await axios.post(CONSTANT_CONFIGS.MAINNET_FULLNODE, {
            'jsonrpc': '1.0',
            'method': 'gettransactionbyhash',
            'params': [txId],
            'id': 1
          });
          const txData = txRes.data.Result;
          const metaData = JSON.parse(txData.Metadata || '{}');
          if (metaData.RequestedTxID === history.txId) {
            receiveTx = txData;
          }
        }

        if (blockData.Height - startBlockHeight > 50) {
          return;
        }

        blockHash = blockData.NextBlockHash;
      }

      const token = tokens.find(item => item.id === history.buyTokenId);
      const output = receiveTx.ProofDetail.OutputCoins || receiveTx.PrivacyCustomTokenProofDetail.OutputCoins;
      const actualAmount = formatUtil.amountFull(output[0].CoinDetails.Value, (token?.pDecimals || 0));
      history.actualAmount = actualAmount;
      saveHistory();

      console.debug('ACTUAL AMOUNT', actualAmount, blockHash);
    } catch (e) {
      console.debug('GET ERROR', e);
    } finally {
      setGettingAmount(false);
    }
  };

  return (
    <View>
      <Header title="pDEX" />
      <View style={styles.historyItem}>
        <Text style={styles.buttonTitle}>{history.type}</Text>
        <Text style={styles.content}>{history.description}</Text>
      </View>
      <ExtraInfo left="Tx ID" right={<CopiableText text={history.txId} data={history.txId} />} />
      <ExtraInfo left="Buy" right={`${history.buyAmount} ${history.buyTokenSymbol}`} />
      <ExtraInfo left="Sell" right={`${history.sellAmount} ${history.sellTokenSymbol}`} />
      <ExtraInfo left="Fee" right={`${history.networkFee} ${history.networkFeeTokenSymbol}`} />
      <ExtraInfo left="Time" right={history.createdAt} />
      <ExtraInfo left="Status" right={history.status} />
      <ExtraInfo left="Account" right={history.account} />
      <ExtraInfo left="Minimum Amount" right={`${history.minimumAmount}  ${history.buyTokenSymbol}`} />
      <ExtraInfo left="Actual Amount" right={`${history.actualAmount} ${history.buyTokenSymbol}`} />

      <RoundCornerButton
        title="Remove"
        style={{ marginTop: 50 }}
        onPress={removeHistory}
      />

      <RoundCornerButton
        title="Get actual amount"
        style={{ marginTop: 20 }}
        onPress={getActualAmount}
        disabled={gettingAmount}
      />
    </View>
  );
};

HistoryDetail.propTypes = {
  history: PropTypes.object.isRequired,
};

HistoryDetail.defaultProps = {
};

export default compose(
  withLayout_2,
  withData,
)(HistoryDetail);
