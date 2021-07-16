import { createSelector } from 'reselect';
import { mergeInput } from '@screens/Dex/Liquidity.utlis';
import {
  USER_FEES,
  TRANSACTION_FEE,
  HEADER_TABS,
  LIQUIDITY_STATUS,
  LIQUIDITY_STATUS_MESSAGE, LIQUIDITY_TITLES, INPUT_FIELDS
} from '@screens/Dex/Liquidity.constants';
import { MESSAGES, MIN_INPUT } from '@screens/Dex/constants';
import { isEmpty, orderBy, uniq, isNumber, floor, ceil } from 'lodash';
import memoize from 'memoize-one';
import { HISTORY_STATUS } from '@src/constants/trading';
import { TX_STATUS } from 'incognito-chain-web-js/build/wallet';
import { PRV_ID } from '@src/constants/common';
import BigNumber from 'bignumber.js';
import formatUtils from '@utils/format';


export const liquiditySelector = createSelector(
  (state) => state.liquidity,
  (liquidity) => liquidity);

export const tabNameSelector = createSelector(
  (state) => state.liquidity,
  (liquidity) => liquidity?.tabName);

export const historyTabNameSelector = createSelector(
  (state) => state.liquidity,
  (liquidity) => liquidity?.historyTabName);

export const mergeInputSelector = createSelector(
  liquiditySelector,
  ({ tabName, addPool, removePool, withDraw }) => mergeInput({ tabName, addPool, removePool, withDraw }),
);

export const inputViewValidatorSelector =  createSelector(
  liquiditySelector,
  (liquidity) => {
    const { tabName, addPool, removePool, withDraw } = liquidity;
    const mergeInputValue = mergeInput({ tabName, addPool, removePool, withDraw });
    const totalFee = USER_FEES;
    const txFee = TRANSACTION_FEE;

    const { inputValue, inputBalance, inputToken, outputValue, outputBalance, outputToken, share, maxInputShare, maxOutputShare, withdrawFeeValue } = mergeInputValue;
    let inputError = '';
    let outputError = '';
    if (tabName === HEADER_TABS.Add) {
      if (totalFee > inputBalance) {
        inputError = MESSAGES.NOT_ENOUGH_PRV_NETWORK_FEE;
      } else if (inputValue + totalFee > inputBalance) {
        inputError = MESSAGES.BALANCE_INSUFFICIENT;
      } else if (inputValue < MIN_INPUT && inputToken) {
        inputError = MESSAGES.GREATER_OR_EQUAL(MIN_INPUT, inputToken.pDecimals);
      } else if (!Number.isInteger(inputValue)) {
        inputError = MESSAGES.MUST_BE_INTEGER;
      }

      if (outputValue > outputBalance) {
        outputError = MESSAGES.BALANCE_INSUFFICIENT;
      } else if (outputValue < MIN_INPUT && outputToken) {
        outputError = MESSAGES.GREATER_OR_EQUAL(MIN_INPUT, outputToken.pDecimals);
      }
    } else if (tabName === HEADER_TABS.Remove) {
      if (!share || inputValue > maxInputShare) {
        inputError = MESSAGES.SHARE_INSUFFICIENT;
      } else if (txFee > inputBalance) {
        inputError = MESSAGES.NOT_ENOUGH_PRV_NETWORK_FEE;
      } else if (inputValue < MIN_INPUT) {
        inputError = MESSAGES.GREATER_OR_EQUAL(MIN_INPUT, inputToken.pDecimals);
      }

      if (!share || outputValue > maxOutputShare) {
        outputError = MESSAGES.SHARE_INSUFFICIENT;
      } else if (outputToken && outputValue < MIN_INPUT) {
        outputError = MESSAGES.GREATER_OR_EQUAL(MIN_INPUT, outputToken.pDecimals);
      }
    } else {
      const _withdrawFeeValue = new BigNumber(withdrawFeeValue || 0).toNumber();
      if (!share || _withdrawFeeValue > share) {
        inputError = MESSAGES.EARNED_FEE_INSUFFICIENT;
      } else if (txFee > inputBalance) {
        inputError = MESSAGES.NOT_ENOUGH_PRV_NETWORK_FEE;
      } else if (!share || _withdrawFeeValue > share) {
        inputError = MESSAGES.SHARE_INSUFFICIENT;
      } else if (!_withdrawFeeValue || !Number.isInteger(_withdrawFeeValue)) {
        inputError = MESSAGES.WITH_DRAW_FEE_MUST_BE_AN_INTERGER_NUMBER;
      }
    }
    return { inputError, outputError };
  }
);

export const mergeHistoriesFieldSelector = createSelector(
  liquiditySelector,
  ({ historyTabName, addPool, removePool, withDraw }) => mergeInput({ tabName: historyTabName, addPool, removePool, withDraw }),
);

export const historiesSelector = createSelector(
  mergeHistoriesFieldSelector,
  ({ storageHistories, apiHistories, name }) => memoize(() => {
    return orderBy(storageHistories.filter(({ pairId, id, requestTx }) => {
      let isExist;
      if (name === INPUT_FIELDS.ADD_POOL) {
        isExist = apiHistories.some(apiHistory => ((apiHistory?.pairId || apiHistory?.id) === (pairId || id)));
      } else {
        isExist = apiHistories.some(apiHistory => ((apiHistory?.requestTx || apiHistory?.id) === (requestTx || id)));
      }
      return !isExist;
    }).concat(apiHistories)
    , 'lockTime', ['desc']);
  }),
);

export const getHistoryById = createSelector(
  historiesSelector,
  historyTabNameSelector,
  (histories, historyTabName) => memoize((id) => {
    let statusText;
    const history = histories().find(history => history.pairId === id || history.id === id);
    if (historyTabName !== HEADER_TABS.Add) {
      const status = history.status;
      if (HISTORY_STATUS.REFUND.includes(status) || HISTORY_STATUS.REJECTED.includes(status)) {
        statusText = LIQUIDITY_STATUS_MESSAGE.FAILED;
      } else if (HISTORY_STATUS.ACCEPTED.includes(status)) {
        statusText = LIQUIDITY_STATUS_MESSAGE.SUCCESSFUL;
      } else {
        statusText = LIQUIDITY_STATUS_MESSAGE.PENDING;
      }
      return {
        ...history,
        statusText,
      };
    }
    let { contributes, pairId } = history;
    contributes.forEach(item => {
      const { status } = item;
      if (isNumber(status)) {
        switch (status) {
        case TX_STATUS.PROCESSING:
        case TX_STATUS.TXSTATUS_PENDING:
          item.status = LIQUIDITY_STATUS.WAITING;
          break;
        case TX_STATUS.TXSTATUS_SUCCESS:
          item.status = LIQUIDITY_STATUS.MATCHED;
          break;
        default:
          item.status = LIQUIDITY_STATUS.FAIL;
        }
      }
    });
    const allStatus = contributes.map(item => item.status);
    if (
      allStatus.includes(LIQUIDITY_STATUS.MATCHED) ||
      allStatus.includes(LIQUIDITY_STATUS.MATCHED_N_RETURNED)
    ) {
      statusText = LIQUIDITY_STATUS_MESSAGE.SUCCESSFUL;
    } else if (allStatus.includes(LIQUIDITY_STATUS.REFUND)) {
      statusText = LIQUIDITY_STATUS_MESSAGE.REFUNDED;
    } else if (allStatus.includes(LIQUIDITY_STATUS.WAITING)) {
      statusText = LIQUIDITY_STATUS_MESSAGE.WAITING;
    } else {
      statusText = LIQUIDITY_STATUS_MESSAGE.FAILED;
    }
    let tokenIdsFromPairId = [];
    if (pairId.split('-').length === 7) {
      tokenIdsFromPairId = [pairId.split('-')[1], pairId.split('-')[3]];
    }
    let tokenIds = uniq(contributes.map(item => item.tokenId).concat(tokenIdsFromPairId));
    const storageContributes = contributes.filter(item => item.isStorage === true);

    let inputTokenId;
    let inputAmount;
    let outputTokenId;
    let outputAmount;
    if (tokenIds.length === 1) {
      inputTokenId = tokenIds[0];
      inputAmount = (contributes.find(contribute => contribute.tokenId === inputTokenId) || {})?.amount;
    } else if (tokenIds.length > 1) {
      inputTokenId = tokenIds[0];
      inputAmount = (contributes.find(contribute => contribute.tokenId === inputTokenId) || {})?.amount;
      outputTokenId = tokenIds[1];
      outputAmount = (contributes.find(contribute => contribute.tokenId === outputTokenId) || {})?.amount;
    }


    let canRetry = false;
    let retryTokenId;
    let retryAmount = 0;

    /** Don't have local storage, 1 contribute is waiting, can retry */
    const countWaiting = contributes.filter(contribute => (contribute.status).toLowerCase() === LIQUIDITY_STATUS.WAITING.toLowerCase()).length;
    if (
      storageContributes.length === 0 &&
      tokenIds.length === 2 &&
      countWaiting === 1 &&
      statusText === LIQUIDITY_STATUS_MESSAGE.WAITING)
    {
      retryTokenId = tokenIds.find(tokenId => contributes.some(contribute => contribute.tokenId !== tokenId));
      canRetry = Boolean(retryTokenId);
    }

    if (storageContributes.length > 0 && [LIQUIDITY_STATUS_MESSAGE.FAILED, LIQUIDITY_STATUS_MESSAGE.WAITING].includes(statusText)) {
      /** Have local storage, contribute is waiting, can retry */
      canRetry = (storageContributes.length > 0) && !storageContributes.some(item => item.status !== LIQUIDITY_STATUS.FAIL);
      if (canRetry) {
        const storageTokenIds = storageContributes.filter(item => item.status === LIQUIDITY_STATUS.FAIL).map(item => item?.tokenId);
        if (storageTokenIds.length > 0) {
          retryTokenId = storageTokenIds[0];
        }
        if (Boolean(canRetry) && Boolean(retryTokenId)) {
          retryAmount = storageContributes.find(item => item.status === LIQUIDITY_STATUS.FAIL)?.amount;
        }
      }
    }

    return {
      ...history,
      tokenIds,
      statusText,
      allStatus,
      contributes,

      canRetry,
      isRetryPRV: retryTokenId === PRV_ID,
      retryTokenId,
      retryAmount,
      inputTokenId,
      inputAmount,
      outputTokenId,
      outputAmount,
    };
  }),
);

export const titleWithHistoryTab = createSelector(
  historyTabNameSelector,
  (historyTabName) => {
    return historyTabName === HEADER_TABS.Add ?
      LIQUIDITY_TITLES.ADD_POOL
      : historyTabName === HEADER_TABS.Remove ? LIQUIDITY_TITLES.REMOVE_POOL : LIQUIDITY_TITLES.WITHDRAW_FEE;
  },
);

export const disableButton = createSelector(
  liquiditySelector,
  inputViewValidatorSelector,
  mergeInputSelector,
  (
    { tabName, isLoading, isFiltering },
    { inputError, outputError },
    { inputValue, outputValue }) => {
    const disabled = !isEmpty(inputError) || !isEmpty(outputError) || isLoading || isFiltering || !inputValue;
    const withdrawFee = HEADER_TABS.Withdraw === tabName ? false : !outputValue;
    return disabled || withdrawFee;
  }
);

export const hasHistories = createSelector(
  liquiditySelector,
  (liquidity) => {
    const { storageHistories, apiHistories } = liquidity[INPUT_FIELDS.ADD_POOL];
    return storageHistories.length > 0 || apiHistories.length > 0;
  }
);

export const shareSelectorWithToken = createSelector(
  liquiditySelector,
  (liquidity) => memoize((inputToken, outputToken) => {
    const { userPairs } = liquidity?.pdeState;
    let share = 0;
    let totalShare = 0;
    let userPair;
    if (inputToken && outputToken) {
      userPair = (userPairs || []).find(({ token1, token2 }) => {
        const tokenIds = [inputToken.id, outputToken.id];
        return tokenIds.includes(token1.id) && tokenIds.includes(token2.id);
      });
      if (userPair) {
        const { totalShare: poolShare, share: shareValue } = userPair;
        share = shareValue;
        totalShare = poolShare;
      }
    }
    return {
      share,
      totalShare,
      userPair,
    };
  })
);


// 1: App tinh Max Token A - Max Token B user dc withdraw
//      a: Tinh % share ( so share / total share)
//      b: Max Token A = % share * pool_size_token_A
//      c: Max Token B = % share * pool_size_token_B
// 2: User nhap so Amount_Token_A muon withdraw
// 3: App tinh so Token B user se withdraw
//      a: Amount_Token_A * Max_Token_B/ Max_Token_A
export const calculatorShareWithDrawSelector = createSelector(
  liquiditySelector,
  shareSelectorWithToken,
  (liquidity, shareValueSelector) => memoize((inputToken, inputValue, outputToken, isInput) => {
    if (!inputToken || !outputToken) return;
    const { share, totalShare, userPair } = shareValueSelector(inputToken, outputToken);
    const poolInputValue = userPair[inputToken.id];
    const poolOutputValue = userPair[outputToken.id];
    const sharePercent = new BigNumber(share).dividedBy(totalShare).toNumber();
    const maxInputShare = new BigNumber(sharePercent).multipliedBy(poolInputValue).toNumber() || 0; // Max_Token_A
    const maxOutputShare = new BigNumber(sharePercent).multipliedBy(poolOutputValue).toNumber() || 0; // Max_Token_B
    const number = new BigNumber(inputValue).multipliedBy(maxOutputShare).dividedBy(maxInputShare).toNumber();
    const outputValue = isInput ? floor(number) : ceil(number);
    const outputText = formatUtils.amountFull(outputValue, outputToken.pDecimals);
    return {
      outputValue,
      outputText,
    };
  })
);
