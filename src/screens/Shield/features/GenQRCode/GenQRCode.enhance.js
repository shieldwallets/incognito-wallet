import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useDispatch } from 'react-redux';
import { compose } from 'recompose';
import { withLayout_2 } from '@src/components/Layout';
import { actionFetch as fetchDataShield } from '@screens/Shield/Shield.actions';
import withShieldUserAddress from '@screens/Shield/features/GenQRCode/GenQRCode.enhanceShieldUserAddress';

const enhance = (WrappedComp) => (props) => {
  const { selectedPrivacy } = props;

  const dispatch = useDispatch();
  const handleShield = async () =>
    await dispatch(fetchDataShield({ tokenId: selectedPrivacy?.tokenId }));

  return (
    <ErrorBoundary>
      <WrappedComp {...{ ...props, handleShield }} />
    </ErrorBoundary>
  );
};

export default compose(
  withLayout_2,
  withShieldUserAddress,
  enhance,
);
