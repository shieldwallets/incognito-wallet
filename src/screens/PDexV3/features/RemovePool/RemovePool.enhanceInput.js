import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {useDispatch} from 'react-redux';
import {removePoolActions} from '@screens/PDexV3/features/RemovePool/index';

const enhance = WrappedComp => props => {
  const dispatch = useDispatch();
  const onChangeInput = (text) => dispatch(removePoolActions.actionChangeInput(text));
  const onChangeOutput = (text) => dispatch(removePoolActions.actionChangeOutput(text));
  const onPressMax = () => dispatch(removePoolActions.actionRemoveMax());
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          onChangeInput,
          onChangeOutput,
          onPressMax,
        }}
      />
    </ErrorBoundary>
  );
};

export default enhance;
