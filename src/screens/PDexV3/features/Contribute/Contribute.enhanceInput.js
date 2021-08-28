import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {useDispatch} from 'react-redux';
import {contributeActions} from '@screens/PDexV3/features/Contribute';

const enhance = WrappedComp => props => {
  const dispatch = useDispatch();
  const onChangeInput = (newText) => dispatch(contributeActions.actionChangeInput(newText));
  const onChangeOutput = (newText) => dispatch(contributeActions.actionChangeOutput(newText));
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          onChangeInput,
          onChangeOutput
        }}
      />
    </ErrorBoundary>
  );
};

export default enhance;
