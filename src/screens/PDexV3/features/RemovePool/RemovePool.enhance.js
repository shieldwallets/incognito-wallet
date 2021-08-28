import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {useDispatch} from 'react-redux';
import {removePoolActions} from '@screens/PDexV3/features/RemovePool/index';

const enhance = WrappedComp => props => {
  const dispatch = useDispatch();
  const actionFetchData = () => dispatch(removePoolActions.actionFetch());
  React.useEffect(() => {
    actionFetchData();
  }, []);
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          onRefresh: actionFetchData
        }}
      />
    </ErrorBoundary>
  );
};

export default enhance;
