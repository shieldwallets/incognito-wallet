import React, { useState } from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { debounce, isEmpty } from 'lodash';
import accountService from '@services/wallet/accountService';
import { PRV_ID } from '@screens/Dex/constants';
import { MAX_FEE_PER_TX } from '@components/EstimateFee/EstimateFee.utils';
import { ExHandler } from '@services/exception';
import { useSelector } from 'react-redux';
import { selectedPrivacySelector } from '@src/redux/selectors';
import { convertCoinsDataSelector } from '@screens/Home/features/Convert/Convert.selector';

const enhance = WrappedComp => props => {
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
