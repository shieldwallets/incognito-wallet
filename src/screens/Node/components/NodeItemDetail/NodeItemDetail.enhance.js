import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import { useDispatch } from 'react-redux';
import {
  actionCheckWithdrawTxs as checkWithdrawTxs,
  actionGetNodesInfoFromApi as getNodesInfoFromApi,
  actionUpdatePNodeItem as updatePNodeItem,
  actionUpdateVNodeItem as updateVNodeItem
} from '@screens/Node/Node.actions';

const withEnhance = WrappedComp => props => {
  const {
    item,
    onImport,
    onStake,
    onUnstake,
    onWithdraw,
    setProcessing,
    isLoading
  } = props;
  const dispatch   = useDispatch();
  const navigation = useNavigation();

  const onHelpPress = () => {
    navigation.navigate(routeNames.NodeItemsHelp);
  };

  const onImportAccountPress = () => {
    onImport && onImport();
  };

  const onWithdrawPress = async () => {
    try {
      setProcessing && setProcessing(true);
      await onWithdraw(item);
    } catch {
      setProcessing && setProcessing(false);
    }
  };

  const onStakePress = () => {
    onStake && onStake(item);
  };

  const onChangeWifiPress = () => {
    navigation.navigate(routeNames.NodeUpdateWifi, {
      device: item
    });
  };

  const onUnStakePress = () => {
    onUnstake && onUnstake(item);
  };

  const getVNodeInfo = () => {
    dispatch(updateVNodeItem(item));
  };

  const getPNodeInfo = () => {
    dispatch(updatePNodeItem(item?.ProductId));
  };

  const onRefreshNodeItem = () => {
    if (isLoading) return;
    dispatch(getNodesInfoFromApi());
    dispatch(checkWithdrawTxs());
    item.IsVNode ? getVNodeInfo() : getPNodeInfo();
  };

  const onUpdateNode = () => {
    navigation.navigate(routeNames.UpdateNodeFirmware, {
      host: item?.Host,
    });
  };

  const onPressMonitorDetail = (blsKey) => {
    navigation.navigate(routeNames.MonitorDetail, {
      blsKey,
    });
  };

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,

          onHelpPress,
          onImportAccountPress,
          onWithdrawPress,
          onStakePress,
          onChangeWifiPress,
          onUnStakePress,
          onRefresh: onRefreshNodeItem,
          onUpdateNode,
          onPressMonitorDetail
        }}
      />
    </ErrorBoundary>
  );
};

export default withEnhance;
