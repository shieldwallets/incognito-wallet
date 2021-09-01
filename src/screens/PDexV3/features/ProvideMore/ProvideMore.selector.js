import {createSelector} from 'reselect';
import {selectedPrivacySelector} from '@src/redux/selectors';
import {MESSAGES} from '@screens/Dex/constants';
import {formValueSelector} from 'redux-form';
import {formConfigs} from '@screens/PDexV3/features/ProvideMore/ProvideMore.constant';
import convert from '@utils/convert';

export const provideMoreSelector = createSelector(
  (state) => state.pDexV3,
  ({ provideMore }) => {
    return provideMore;
  },
);

export const coinSelector = createSelector(
  provideMoreSelector,
  ({ coin }) => coin,
);

const inputValueSelector = createSelector(
  (state) => state,
  coinSelector,
  (state, coin) => {
    const selector = formValueSelector(formConfigs.formName);
    const inputText = selector(state, formConfigs.input);
    const inputNumber = convert.toNumber(inputText, true) || 0;
    return convert.toOriginalAmount(inputNumber, coin.token.pDecimals);
  }
);

const feeSelector = createSelector(
  coinSelector,
  selectedPrivacySelector.getPrivacyDataByTokenID,
  ({ feeTokenId, feeAmount }, getPrivacyDataByTokenID) => {
    const feeToken = getPrivacyDataByTokenID(feeTokenId);
    const feeUserBalance = feeToken.amount;
    return {
      feeAmount,
      feeToken,
      feeTokenId,
      feeUserBalance
    };
  }
);

export const validateSelector = createSelector(
  coinSelector,
  feeSelector,
  inputValueSelector,
  (coin, fee, inputValue) => () => {
    try {
      const { userBalance } = coin;
      const { feeAmount, feeUserBalance } = fee;
      if (feeAmount > feeUserBalance) {
        return MESSAGES.NOT_ENOUGH_PRV_NETWORK_FEE;
      } else if (inputValue > userBalance) {
        return MESSAGES.BALANCE_INSUFFICIENT;
      }
    } catch (error) {
      return error.message;
    }
  },
);

export const disableBtnProvide = createSelector(
  inputValueSelector,
  validateSelector,
  (inputValue, validate) => (inputValue <= 0 || !!validate()),
);
