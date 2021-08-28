import {createSelector} from 'reselect';
import {formatBalance, getPoolSize} from '@screens/PDexV3';
import {getExchangeRate} from '@screens/Liquidity3/Liquidity3.utils';
import helper from '@src/constants/helper';
import {getPrivacyDataByTokenID as getPrivacyDataByTokenIDSelector} from '@src/redux/selectors/selectedPrivacy';
import {getDataByShareIdSelector} from '@src/screens/PDexV3/features/Portfolio/Portfolio.selector';
import {sharedSelector} from '@src/redux/selectors';
import {getInputAmount} from '@screens/PDexV3/features/Contribute/Contribute.utils';

export const contributeSelector = createSelector(
  (state) => state.pDexV3,
  ({ contribute }) => {
    return contribute;
  },
);
export const contributePoolIDSelector = createSelector(
  contributeSelector,
  ({ poolId }) => poolId,
);
export const contributePoolDetailSelector = createSelector(
  contributeSelector,
  ({ poolDetail }) => poolDetail,
);

export const contributeValueSelector = createSelector(
  contributeSelector,
  ({ inputValue, inputText, outputValue, outputText }) => ({
    inputValue,
    inputText,
    outputValue,
    outputText,
  }),
);

export const statusContributeSelector = createSelector(
  contributeSelector,
  ({ isFetching, isFetched }) => {
    const isLoading = (isFetching && !isFetched);
    const isError = !isFetching && !isFetched;
    return {
      isLoading,
      isError,
    };
  },
);

export const tokenSelector = createSelector(
  contributeSelector,
  getPrivacyDataByTokenIDSelector,
  ({ inputToken, outputToken }, getPrivacyDataByTokenID) => {
    if (!inputToken || !outputToken) return {};
    const _inputToken = getPrivacyDataByTokenID(inputToken);
    const _outputToken = getPrivacyDataByTokenID(outputToken);
    return {
      inputToken: _inputToken,
      outputToken: _outputToken,
    };
  },
);

export const feeAmountSelector = createSelector(
  contributeSelector,
  ({ feeAmount }) => feeAmount,
);

export const inputAmountSelector = createSelector(
  (state) => state,
  sharedSelector.isGettingBalance,
  tokenSelector,
  feeAmountSelector,
  getInputAmount
);

export const contributeDataSelector = createSelector(
  contributePoolDetailSelector,
  getPrivacyDataByTokenIDSelector,
  getDataByShareIdSelector,
  tokenSelector,
  sharedSelector.isGettingBalance,
  (
    poolDetail,
    getPrivacyDataByTokenID,
    getDataShareByPoolId,
    { inputToken, outputToken },
    isGettingBalance,
  ) => {
    if (!poolDetail || !inputToken || !outputToken) return {};
    const { poolId, amp, token1Value: token1PoolValue, token2Value: token2PoolValue } = poolDetail;
    const shareStr = getDataShareByPoolId(poolId)?.shareStr || '0 (0%)';
    const exchangeRateStr = getExchangeRate(inputToken, outputToken, token1PoolValue, token2PoolValue);
    const poolSize = getPoolSize(inputToken, outputToken, token1PoolValue, token2PoolValue);
    const balanceStr = formatBalance(inputToken, outputToken, inputToken.amount, outputToken?.amount);
    const isLoadingBalance = isGettingBalance.includes(inputToken?.tokenId) || isGettingBalance.includes(outputToken?.tokenId);
    const hookFactories = [
      {
        label: 'AMP',
        value: amp,
        info: helper.HELPER_CONSTANT.AMP
      },
      {
        label: 'Balance',
        value: balanceStr,
        loading: isLoadingBalance
      },
      {
        label: 'Share',
        value: shareStr,
      },
      {
        label: 'Exchange rate',
        value: exchangeRateStr,
      },
      {
        label: 'Pool size',
        value: poolSize,
      },
    ];
    return {
      ...poolDetail,
      hookFactories,
      inputToken,
      outputToken,
      token1PoolValue,
      token2PoolValue,
    };
  }
);
