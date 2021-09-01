import {createSelector} from 'reselect';
import {selectedPrivacySelector as selectedPrivacy, sharedSelector} from '@src/redux/selectors';
import formatUtil from '@utils/format';

export const provideSelector = createSelector(
  (state) => state.pDexV3,
  ({ provide }) => {
    return provide;
  },
);

export const statusProvideSelector = createSelector(
  provideSelector,
  ({ isFetching, isFetched }) => {
    const isLoading = (isFetching && !isFetched);
    const isError = !isFetching && !isFetched;
    return {
      isLoading,
      isError,
    };
  },
);

export const provideDataSelector = createSelector(
  provideSelector,
  selectedPrivacy.getPrivacyDataByTokenID,
  sharedSelector.isGettingBalance,
  ({ data }, getPrivacyDataByTokenID, isGettingBalance) => {
    return (data || []).map(item => {
      const { tokenId, apy, balance } = item;
      const token = getPrivacyDataByTokenID(tokenId);
      const userBalance = token.amount;
      const userBalanceStr = formatUtil.amountFull(token.amount, token.pDecimals, true);
      const isLoadingBalance = isGettingBalance.includes(tokenId);
      const hooks = {
        displayInterest: `${formatUtil.toFixed(apy || 21, 2)}%  APY`,
        displayBalance: formatUtil.amountFull(balance, token.pDecimals, true),
        userBalance,
        userBalanceStr,
        isLoadingBalance,
      };
      return {
        token,
        tokenId,
        ...item,
        ...hooks,
      };
    });
  }
);
