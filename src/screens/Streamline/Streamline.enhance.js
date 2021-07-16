import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { compose } from 'recompose';
import { withLayout_2 } from '@src/components/Layout';
import { useDispatch } from 'react-redux';
import { useNavigationParam } from 'react-navigation-hooks';
import { actionClearStreamLine, actionTogglePending } from './Streamline.actions';

const enhance = (WrappedComp) => (props) => {
  const dispatch = useDispatch();

  const handleFetchData = useNavigationParam('handleFetchData');
  const onClearData = () => dispatch(actionClearStreamLine());

  React.useEffect(() => {
    return () => {
      dispatch(actionTogglePending(false));
    };
  }, []);

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          onClearData,
          handleFetchData
        }}
      />
    </ErrorBoundary>
  );
};

export default compose(
  withLayout_2,
  enhance,
);
