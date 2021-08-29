import {createSelector} from 'reselect';
import {selectedPrivacySelector as selectedPrivacy} from '@src/redux/selectors';
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
  ({ data }, getPrivacyDataByTokenID) => {
    return (data || []).map(item => {
      const { tokenId, apy, balance } = item;
      const token = getPrivacyDataByTokenID(tokenId);
      const hooks = {
        displayInterest: `${formatUtil.toFixed(apy || 21, 2)}%  APY`,
        displayBalance: formatUtil.amountFull(balance, token.pDecimals, true),
      };
      return {
        token,
        ...data,
        ...hooks,
      };
    });
  }
);
