import React from 'react';
import { useNavigationParam } from 'react-navigation-hooks';

const withData = WrappedComp => (props) => {
  const history = useNavigationParam('history');
  const tokens = useNavigationParam('tokens');

  return (
    <WrappedComp
      {...{
        ...props,
        history,
        tokens,
      }}
    />
  );
};

export default withData;
