import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {useDispatch} from 'react-redux';
import {createPoolActions} from '@screens/PDexV3/features/CreatePool/index';

const enhance = WrappedComp => props => {
  const dispatch = useDispatch();
  const onInit = () => dispatch(createPoolActions.actionInit());

  React.useEffect(() => {
    onInit();
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
