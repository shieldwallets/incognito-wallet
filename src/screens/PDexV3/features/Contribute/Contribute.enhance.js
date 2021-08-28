import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {useDispatch} from 'react-redux';
import {contributeActions} from '@screens/PDexV3/features/Contribute';

const enhance = WrappedComp => props => {
  const dispatch = useDispatch();
  const handleOnRefresh = () => dispatch(contributeActions.actionFetchData());
  React.useEffect(() => {
    handleOnRefresh();
    return(() => {
      dispatch(contributeActions.actionFeeContribute());
    });
  }, []);
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          onRefresh: handleOnRefresh
        }}
      />
    </ErrorBoundary>
  );
};

export default enhance;
