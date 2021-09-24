import React from 'react';
import { HomeTabHeader } from '@screens/PDexV3/features/Home';
import { useSelector } from 'react-redux';
import { tradingVolume24hSelector } from '@src/screens/PDexV3/features/Pools';

export default React.memo(() => {
  const tradingVolume24h = useSelector(tradingVolume24hSelector);
  return <HomeTabHeader title="24h Trading Volume" desc={`$${tradingVolume24h}`} />;
});
