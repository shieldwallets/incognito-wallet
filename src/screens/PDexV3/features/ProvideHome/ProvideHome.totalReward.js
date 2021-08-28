import React from 'react';
import {TotalReward} from '@components/core';
import {useSelector} from 'react-redux';
import {selectedPrivacySelector} from '@src/redux/selectors';
import {PRV_ID} from '@screens/DexV2/constants';
import routeNames from '@routers/routeNames';

const ProvideTotalReward = () => {
  const nativeToken = useSelector(selectedPrivacySelector.getPrivacyDataByTokenID)(PRV_ID);
  return (
    <TotalReward
      total={10000}
      nativeToken={nativeToken}
      subTitle="Compounding Rewards"
      helperScreen={routeNames.PoolV2Help}
    />
  );
};

export default React.memo(ProvideTotalReward);
