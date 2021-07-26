import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {batch, useDispatch} from 'react-redux';
import { debounce } from 'lodash';
import { actionClearHistories , actionFetchData, actionFetchHistories } from '@screens/Dex/Liquidity.actions';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';

const enhance = WrappedComp => props => {
  const { account } = props;
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleLoadData = React.useCallback(debounce(() => {
    batch(() => {
      dispatch(actionFetchData());
    });
  }, 500), [dispatch]);

  const handleLoadHistories = React.useCallback(debounce(() => {
    batch(() => {
      dispatch(actionClearHistories({ clearTab: undefined }));
      dispatch(actionFetchHistories());
    });
  }, 500), [dispatch]);

  const onNextPress = (liquidityTitle) => {
    navigation.navigate(routeNames.ConfirmLiquidity, { title: liquidityTitle, onNavSuccess: () => {
      handleLoadHistories();
      handleLoadData();
    } });
  };

  const onHistoriesPress = () => {
    navigation.navigate(routeNames.HistoriesLiquidity);
  };

  React.useEffect(() => {
    handleLoadData();
  }, [account.name]);


  React.useEffect(() => {
    handleLoadHistories();
  }, [account.name]);

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          onLoadData: handleLoadData,
          onNextPress,
          onHistoriesPress
        }}
      />
    </ErrorBoundary>
  );
};

export default enhance;
