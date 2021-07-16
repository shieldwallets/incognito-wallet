import React from 'react';
import ErrorBoundary from '@components/ErrorBoundary';
import {
  actionClearConvertData,
  actionFetchCoinsV1,
} from '@screens/Home/features/Convert/Convert.actions';
import { useFocusEffect, useNavigation } from 'react-navigation-hooks';
import { useDispatch, useSelector } from 'react-redux';
import { accountSelector } from '@src/redux/selectors';
import { ExHandler } from '@services/exception';
import routeNames from '@routers/routeNames';
import { actionFree as actionFreeHistory } from '@src/redux/actions/history';
import { clearSelectedPrivacy } from '@src/redux/actions/selectedPrivacy';

const convertTokenListEnhance = (WrappedComp) => (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const account = useSelector(accountSelector.defaultAccountSelector);

  const fetchCoinsV1 = (isRefresh = false) => {
    try {
      dispatch(actionFetchCoinsV1(isRefresh));
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };

  const onNavigateToConvert = () => {
    navigation.navigate(routeNames.Convert, { fetchCoinsV1 });
  };

  const onPullRefresh = () => {
    fetchCoinsV1(true);
  };

  React.useEffect(() => {
    if (!account) return;
    fetchCoinsV1();
    return () => {
      dispatch(actionClearConvertData());
    };
  }, [account]);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(actionFreeHistory());
      dispatch(clearSelectedPrivacy());
    }, []),
  );

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          onNavigateToConvert,
          onPullRefresh,
        }}
      />
    </ErrorBoundary>
  );
};

export default convertTokenListEnhance;
