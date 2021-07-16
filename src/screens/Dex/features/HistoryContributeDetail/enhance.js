import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {useNavigation, useNavigationParam} from 'react-navigation-hooks';
import {useSelector} from 'react-redux';
import { getHistoryById, historyTabNameSelector } from '@screens/Dex/Liquidity.selector';
import {accountSelector, selectedPrivacySelector} from '@src/redux/selectors';
import { uniq } from 'lodash';
import {accountServices} from '@services/wallet';
import {ExHandler} from '@services/exception';
import routeNames from '@routers/routeNames';
import {TRANSACTION_FEE} from '@screens/Dex/Liquidity.constants';

const withHistory = WrappedComp => props => {
  const id = useNavigationParam('id');
  const history = useSelector(getHistoryById)(id);
  const historyTab = useSelector(historyTabNameSelector);
  const navigation = useNavigation();
  const wallet = useSelector(state => state.wallet);
  const account = useSelector(accountSelector.defaultAccount);
  const {
    canRetry,
    retryTokenId,
    retryAmount,
    isRetryPRV,

    inputTokenId,
    inputAmount,
    outputTokenId,
    outputAmount,
    pairId,
    contributes
  } = history;
  const getPrivacyDataByTokenID = useSelector(selectedPrivacySelector.getPrivacyDataByTokenID);

  const [balance, setBalance] = React.useState({
    prvBalance: undefined,
    pTokenBalance: undefined
  });
  const [loading, setLoading] = React.useState(false);

  const getAccountBalance = async () => {
    if (!history || !retryTokenId) return;
    try {
      setLoading(true);
      const tokenIds = uniq(outputTokenId ? [inputTokenId, outputTokenId] : [inputTokenId]);
      const tasks = tokenIds.map((tokenId) => (
        accountServices.getBalance({
          account,
          wallet,
          tokenID: tokenId
        })
      ));
      const balance = await Promise.all(tasks);
      if (balance.length === 1) {
        setBalance({
          prvBalance: balance[0] || 0,
          pTokenBalance: undefined
        });
      } else {
        setBalance({
          prvBalance: balance[0] || 0,
          pTokenBalance: balance[1] || 0
        });
      }
      setLoading(false);
    } catch (e) {
      new ExHandler(e).showErrorToast(true);
    }
  };

  const navigateToRetry = (isRetry) => {
    const retryToken = getPrivacyDataByTokenID(retryTokenId);
    const params = {
      isRetry: !!isRetry,
      retryToken,
      retryAmount: isRetry ? retryAmount : TRANSACTION_FEE,
      prvBalance: balance?.prvBalance,
      pTokenBalance: balance?.pTokenBalance,
      isRetryPRV,

      inputTokenId,
      inputAmount,
      outputTokenId,
      outputAmount,
      pairId
    };
    navigation.navigate(routeNames.ConfirmRetryLiquidity, {
      params
    });
  };

  React.useEffect(() => {
    if (!canRetry || !retryTokenId) return;
    getAccountBalance().then();
  }, [canRetry, retryTokenId, retryAmount, isRetryPRV]);

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          history,
          historyTab,
          prvBalance: balance?.prvBalance,
          pTokenBalance: balance?.pTokenBalance,
          canRetry,
          retryTokenId,
          retryAmount,
          loading,
          isRetryPRV,
          outputTokenId,
          inputTokenId,
          contributes,
          navigateToRetry
        }}
      />
    </ErrorBoundary>
  );
};

export default withHistory;
