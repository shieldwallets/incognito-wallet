import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {useDispatch} from 'react-redux';

const withChangeInput = WrappedComp => props => {
  const dispatch = useDispatch();
  // const onChangeInput = (text) =>

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

export default withChangeInput;
