import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { View, Text, ScrollView, FlexView } from '@components/core';
import { withLayout_2 } from '@components/Layout';
import Header from '@components/Header/index';
import { useSelector } from 'react-redux';
import { maxPriceSelector } from '@screens/DexV2/components/Trade/TradeV2/Trade.selector';
import { TRANSFER_STATUS } from '@src/redux/actions/dex';
import { Hook } from '@screens/Wallet/features/TxHistoryDetail/TxHistoryDetail';
import isEmpty from 'lodash/isEmpty';
import linkingService from '@services/linking';
import {CONSTANT_CONFIGS} from '@src/constants';
import styles from './style';
import withData from './data.enhance';

const HistoryDetail = ({ history }) => {
  const isSuccess = history?.status === TRANSFER_STATUS.SUCCESSFUL;
  const buyAmount = history?.buyAmount;

  const maxPrice = useSelector(maxPriceSelector)(
    history?.sellTokenId,
    history?.buyTokenId,
    history?.sellAmount,
    buyAmount,
  );

  const handleOpenLink = (txID) => {
    if (!txID) return;
    linkingService.openUrl(`${CONSTANT_CONFIGS.EXPLORER_CONSTANT_CHAIN_URL}/tx/${txID}`,);
  };

  const renderContent = () => {
    let _responseTx = [];
    if (!isEmpty(history?.responseTx)) {
      const responseTx = history?.responseTx;
      if (responseTx.length === 1) {
        _responseTx = [{
          label: 'ResponseTx',
          valueText: responseTx[0],
          copyable: true,
          openUrl: true,
          handleOpenLink: () => {
            handleOpenLink(responseTx[0]);
          }
        }];
      } else {
        _responseTx = responseTx.map((item, index) => ({
          label: `ResponseTx${index + 1}`,
          valueText: item,
          copyable: true,
          openUrl: true,
          handleOpenLink: () => {
            handleOpenLink(item);
          }
        }));
      }
    }

    const factories = [
      {
        label: 'RequestTx',
        valueText: history?.requestTx,
        copyable: true,
        openUrl: history?.requestTx,
        handleOpenLink: () => {
          handleOpenLink(history?.requestTx);
        }
      },
      ..._responseTx,
      {
        label: 'Buy',
        valueText: `${buyAmount} ${history?.buyTokenSymbol}`,
      },
      {
        label: 'Sell',
        valueText: `${history?.sellAmount} ${history?.sellTokenSymbol}`,
      },
      {
        label: 'Trading fee',
        valueText: `${history?.tradingFee} ${history?.tradingFeeTokenSymbol}`,
      },
      {
        label: 'Time',
        valueText: history?.createdAt,
      },
      {
        label: 'Status',
        valueText: history?.status,
      },
      {
        label: 'Account',
        valueText: history?.account,
      },
      {
        label: 'Exchange',
        valueText: history?.exchange,
      },
      {
        label: isSuccess ? 'Price' : 'Max price',
        valueText: maxPrice,
        disabled: !maxPrice,
      },
    ];
    return factories.map(data => <Hook key={data?.label} {...data} />);
  };
  return (
    <FlexView>
      <Header title="pDEX" />
      <View style={styles.historyItem}>
        <Text style={styles.buttonTitle}>{history?.type}</Text>
        <Text style={styles.content}>{history?.description}</Text>
      </View>
      <ScrollView paddingBottom>
        {renderContent()}
      </ScrollView>
    </FlexView>
  );
};

HistoryDetail.propTypes = {
  history: PropTypes.object.isRequired,
};

HistoryDetail.defaultProps = {};

export default compose(
  withLayout_2,
  withData,
)(HistoryDetail);
