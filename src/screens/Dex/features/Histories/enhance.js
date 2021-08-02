import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useDispatch, useSelector } from 'react-redux';
import { historiesSelector, liquiditySelector } from '@screens/Dex/Liquidity.selector';
import { HEADER_TABS } from '@screens/Dex/Liquidity.constants';
import {
  actionFetchContributeHistories,
  actionFetchWithdrawFeeHistories,
  actionFetchWithdrawHistories
} from '@screens/Dex/Liquidity.actions';
import { ExHandler } from '@services/exception';

const enhance = WrappedComp => props => {
  const dispatch = useDispatch();
  const histories = useSelector(historiesSelector)();

  const {
    historyTabName,
  } = useSelector(liquiditySelector);

  const [refreshing, setRefreshing] = React.useState(false);
  const [isLoadMore, setLoadMore] = React.useState(false);

  const onFetchHistories = async ({ isRefresh = false } = {}) => {
    if(historyTabName === HEADER_TABS.Add) {
      return dispatch(actionFetchContributeHistories({ isRefresh }));
    } else if (historyTabName === HEADER_TABS.Remove) {
      return dispatch(actionFetchWithdrawHistories({ isRefresh }));
    }
    return dispatch(actionFetchWithdrawFeeHistories({ isRefresh }));
  };

  const onRefresh = async () => {
    if (refreshing || isLoadMore) return;
    try {
      setRefreshing(true);
      await onFetchHistories({ isRefresh: true });
    } catch (error) {
      new ExHandler(error).showErrorToast();
    } finally {
      setRefreshing(false);
    }
  };

  const onLoadMore = async () => {
    if (refreshing || isLoadMore) return;
    try {
      setLoadMore(true);
      await onFetchHistories();
    } catch (error) {
      new ExHandler(error).showErrorToast();
    } finally {
      setLoadMore(false);
    }
  };

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          histories,
          historyTabName,

          onFetchHistories,
          onRefresh,
          onLoadMore,
          refreshing,
          isLoadMore
        }}
      />
    </ErrorBoundary>
  );
};

export default enhance;
