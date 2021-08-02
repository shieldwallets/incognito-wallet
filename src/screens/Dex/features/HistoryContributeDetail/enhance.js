import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {useNavigation, useNavigationParam} from 'react-navigation-hooks';
import {useSelector} from 'react-redux';
import { getHistoryById, historyTabNameSelector } from '@screens/Dex/Liquidity.selector';
import {accountSelector} from '@src/redux/selectors';
import { uniq } from 'lodash';
import {accountServices} from '@services/wallet';
import {ExHandler} from '@services/exception';
import routeNames from '@routers/routeNames';
import {PRV_ID} from '@screens/Dex/constants';

const withHistory = WrappedComp => props => {
  const id = useNavigationParam('id');
  const history = useSelector(getHistoryById)(id);
  const historyTab = useSelector(historyTabNameSelector);
  const navigation = useNavigation();
  const wallet = useSelector(state => state.wallet);
  const account = useSelector(accountSelector.defaultAccount);
  const {
    contributes,

    refundTokenID,
    refundAmount,
    retryTokenID,
    retryAmount,
    retryToken,
    refundToken,
    showRetry,
    showRefund,
    pairId,
  } = history;

  const [balance, setBalance] = React.useState({
    prvBalance: undefined,
    refundTokenBalance: undefined,
    retryTokenBalance: undefined,
  });
  const [loading, setLoading] = React.useState(false);

  const getAccountBalance = async () => {
    try {
      setLoading(true);
      const tokenIds = uniq(showRetry ? [PRV_ID, refundTokenID, retryTokenID] : [PRV_ID, refundTokenID]);
      const tasks = tokenIds.map(async (tokenID) => {
        const balance = await accountServices.getBalance({
          account,
          wallet,
          tokenID
        });
        return {
          tokenID,
          balance
        };
      });
      const balances = await Promise.all(tasks);

      let value = {
        prvBalance: undefined,
        refundTokenBalance: undefined,
        retryTokenBalance: undefined,
      };
      balances.forEach((token) => {
        const { tokenID, balance } = token;
        if (tokenID === PRV_ID) {
          value = {...value, prvBalance: balance};
        }
        if (tokenID === refundTokenID) {
          value = {...value, refundTokenBalance: balance};
        }
        if (tokenID === retryTokenID) {
          value = {...value, retryTokenBalance: balance};
        }
      });
      setBalance(value);
      setLoading(false);
    } catch (e) {
      new ExHandler(e).showErrorToast(true);
    }
  };

  const navigateToRetry = (isRetry) => {
    const params = {
      isRetry,
      retryTokenID,
      refundTokenID,
      retryAmount,
      refundAmount,
      pairId,
      retryToken,
      refundToken,
    };
    navigation.navigate(routeNames.ConfirmRetryLiquidity, {
      params,
    });
  };

  React.useEffect(() => {
    if (!refundTokenID || !retryTokenID) return;
    getAccountBalance().then();
  }, [
    refundTokenID,
    refundAmount,
    retryTokenID,
    retryAmount,
  ]);

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          history,
          historyTab,
          loading,
          contributes,
          navigateToRetry,

          showRetry,
          showRefund,
          refundTokenBalance: balance?.refundTokenBalance,
          retryTokenBalance: balance?.retryTokenBalance,
          prvBalance: balance?.prvBalance,
          refundTokenID,
          refundAmount,
          retryTokenID,
          retryAmount,
        }}
      />
    </ErrorBoundary>
  );
};

export default withHistory;
