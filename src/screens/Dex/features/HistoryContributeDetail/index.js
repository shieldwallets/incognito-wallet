import React from 'react';
import { ScrollView, View } from 'react-native';
import withHistory from '@screens/Dex/features/HistoryContributeDetail/enhance';
import { Header } from '@src/components';
import { Hook } from '@screens/Wallet/features/TxHistoryDetail/TxHistoryDetail';
import { isEmpty } from 'lodash';
import { useSelector } from 'react-redux';
import { selectedPrivacySelector } from '@src/redux/selectors';
import formatUtil from '@utils/format';
import PropTypes from 'prop-types';
import { styledForm as styled } from '@screens/Send/features/Form/Form.styled';
import { ButtonBasic } from '@components/Button';
import { LIQUIDITY_STATUS, LIQUIDITY_STATUS_MESSAGE } from '@screens/Dex/Liquidity.constants';
import withValidate from '@screens/Dex/features/HistoryContributeDetail/enhanceValidator';
import {compose} from 'recompose';
import linkingService from '@services/linking';
import { CONSTANT_CONFIGS } from '@src/constants';

const HistoryContributeDetail = React.memo(({
  history,
  canRetry,
  loading,
  showRetry,
  navigateToRetry,
}) => {
  const getPrivacyDataByTokenID = useSelector(selectedPrivacySelector.getPrivacyDataByTokenID);
  const { pairId, statusText } = history;
  const handleOpenLink = (txID) => {
    if (!txID) return;
    linkingService.openUrl(`${CONSTANT_CONFIGS.EXPLORER_CONSTANT_CHAIN_URL}/tx/${txID}`,);
  };
  const historyFactory = [
    {
      label: 'PairID',
      valueText: pairId,
      copyable: true,
    },
    {
      label: 'Status',
      valueText: statusText,
    },
  ];

  const renderSection = (data, index) => {
    index += 1;
    const { requestTx, returnAmount, respondTx, amount, tokenId, status } = data;
    const token = getPrivacyDataByTokenID(tokenId);
    const sectionFactor = [
      {
        label: `TxID${index}`,
        valueText: requestTx,
        copyable: true,
        openUrl: true,
        handleOpenLink: () => {
          handleOpenLink(requestTx);
        }
      },
      {
        label: `Status${index}`,
        valueText: status ? status.charAt(0).toUpperCase() + status.slice(1) : '',
        disabled: isEmpty(status) || (statusText !== LIQUIDITY_STATUS_MESSAGE.WAITING),
      },
      {
        label: `ResponseTxID${index}`,
        valueText: respondTx,
        copyable: true,
        disabled: isEmpty(respondTx),
        openUrl: true,
        handleOpenLink: () => {
          handleOpenLink(respondTx);
        }
      },
      {
        label: `Amount${index}`,
        valueText: `${formatUtil.amountFull(amount, token.pDecimals)} ${token.symbol}`,
        disabled: !amount
      },
      {
        label: `ReturnAmount${index}`,
        valueText: `${formatUtil.amountFull(returnAmount, token.pDecimals)} ${token.symbol}`,
        disabled: !returnAmount
      }
    ];
    return sectionFactor.map(data => <Hook key={data?.label} {...data} />);
  };

  const renderContent = () => {
    let contributes = history?.contributes;
    const contributeMatched = contributes.filter(({ status }) => status === LIQUIDITY_STATUS.MATCHED);
    const contributeWaiting = contributes.filter(({ status }) => status === LIQUIDITY_STATUS.WAITING);
    const isCreatePool = contributeMatched.length === 1 && contributeWaiting.length === 1;
    if (LIQUIDITY_STATUS_MESSAGE.SUCCESSFUL === statusText && isCreatePool) {
      contributes = [...contributeWaiting, ...contributeMatched];
    } else if ([LIQUIDITY_STATUS_MESSAGE.SUCCESSFUL, LIQUIDITY_STATUS_MESSAGE.REFUNDED].includes(statusText)) {
      contributes = history?.contributes.filter(({ status }) => status !== LIQUIDITY_STATUS.WAITING);
    }
    return contributes.map(renderSection);
  };

  return (
    <View style={{ marginHorizontal: 25, flex: 1 }}>
      <Header title="Liquidity" />
      <ScrollView>
        {historyFactory.map(data => <Hook key={data?.label} {...data} />)}
        {renderContent()}
        {canRetry && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <ButtonBasic
              title="Refund"
              btnStyle={[
                styled.submitBtn,
                showRetry ? { width: '48%' } : { flex: 1 }
              ]}
              disabled={loading}
              loading={loading}
              onPress={() => navigateToRetry(false)}
            />
            {!!showRetry && (
              <ButtonBasic
                title="Retry"
                btnStyle={[
                  styled.submitBtn,
                  { width: '48%' }
                ]}
                disabled={loading}
                loading={loading}
                onPress={() => navigateToRetry(true)}
              />
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
});

HistoryContributeDetail.propTypes = {
  history: PropTypes.object.isRequired,
  canRetry: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  prvBalance: PropTypes.number.isRequired,
  pTokenBalance: PropTypes.number.isRequired,
  retryTokenId: PropTypes.string.isRequired,
  retryAmount: PropTypes.number.isRequired,
  isRetryPRV: PropTypes.bool.isRequired,
  showRetry: PropTypes.bool.isRequired,
  navigateToRetry: PropTypes.func.isRequired,
};


export default compose(
  withHistory,
  withValidate
)(HistoryContributeDetail);
