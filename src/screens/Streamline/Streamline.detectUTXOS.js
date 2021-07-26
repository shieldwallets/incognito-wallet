import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useDispatch, useSelector } from 'react-redux';
import { defaultAccountSelector } from '@src/redux/selectors/account';
import { actionConditionConsolidate } from '@screens/Streamline/Streamline.actions';
import { useNavigation } from 'react-navigation-hooks';
import { setSelectedPrivacy } from '@src/redux/actions/selectedPrivacy';
import routeNames from '@routers/routeNames';

const withDetectUTXOS = WrappedComp => props => {
  const dispatch = useDispatch();
  const account = useSelector(defaultAccountSelector);
  const navigation = useNavigation();
  const refFirstTime = React.useRef(true);
  const checkConditionConsolidate = () => dispatch(actionConditionConsolidate());

  const onSelectItem = (tokenID) => {
    dispatch(setSelectedPrivacy(tokenID));
    navigation.navigate(routeNames.Streamline, {
      handleFetchData: checkConditionConsolidate
    });
  };

  const onRefresh = () => {
    checkConditionConsolidate();
  };

  React.useEffect(() => {
    if (!refFirstTime.current) {
      checkConditionConsolidate();
    }
    refFirstTime.current = false;
  }, [account, refFirstTime]);

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          checkConditionConsolidate,
          onSelectItem,
          onPullRefresh: onRefresh,
        }}
      />
    </ErrorBoundary>
  );
};

export default withDetectUTXOS;
