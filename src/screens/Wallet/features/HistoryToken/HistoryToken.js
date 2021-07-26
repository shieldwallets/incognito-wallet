import React from 'react';
import HistoryList from '@src/screens/Wallet/features/HistoryList';
import { useSelector } from 'react-redux';
import { historyTxsSelector } from '@src/redux/selectors/history';
import { useHistoryEffect } from '@src/screens/Wallet/features/History/History.useEffect';
import EmptyHistory from './HistoryToken.empty';

const HistoryToken = () => {
  const { histories, isEmpty, loading, refreshing, oversize } = useSelector(
    historyTxsSelector,
  );
  const { handleRefresh, handleCancelEtaHistory } = useHistoryEffect();
  return (
    <HistoryList
      histories={histories}
      onCancelEtaHistory={handleCancelEtaHistory}
      onRefreshHistoryList={handleRefresh}
      refreshing={refreshing}
      loading={loading}
      renderEmpty={() => <EmptyHistory />}
      showEmpty={isEmpty}
      oversize={oversize}
    />
  );
};

HistoryToken.propTypes = {};

export default HistoryToken;
