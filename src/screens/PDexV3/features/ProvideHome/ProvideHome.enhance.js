import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {useDispatch} from 'react-redux';
import {provideHomeActions} from '@screens/PDexV3/features/ProvideHome/index';

const enhance = WrappedComp => props => {
  const dispatch = useDispatch();
  const fetchData = () => dispatch(provideHomeActions.actionFetch());
  React.useEffect(() => {
    fetchData();
  }, []);
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
        }}
      />
    </ErrorBoundary>
  );
};

export default enhance;
