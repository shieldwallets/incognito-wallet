import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { compose } from 'recompose';
import { useNavigationParam } from 'react-navigation-hooks';
import { CONSTANT_CONFIGS } from '@src/constants';

const enhance = WrappedComp => props => {
  const blsKey = useNavigationParam('blsKey') || [];
  const URL = CONSTANT_CONFIGS.NODE_MONITOR_DETAIL_URL + blsKey;
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          url: URL
        }}
      />
    </ErrorBoundary>
  );
};

export default compose(enhance);
