import React from 'react';
import { ActivityIndicator } from '@components/core/index';
import routeNames from '@routers/routeNames';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import UnstakeVNode from './UnstakeVNode';
import UnstakePNode from './UnstakePNode';


const UnstakeContainer = React.memo(() => {
  const device = useNavigationParam('device');
  const navigation = useNavigation();

  const handleCompleteUnstake = () => {
    navigation.navigate(routeNames.Node, {
      refresh: new Date().getTime()
    });
  };

  const renderUnstakePNode = () => (
    <UnstakePNode
      device={device}
      onFinish={handleCompleteUnstake}
    />
  );

  const renderUnstakeVNode = () => (
    <UnstakeVNode
      device={device}
      onFinish={handleCompleteUnstake}
    />
  );

  const isVNode = React.useMemo(() => {
    return !device.IsPNode || device.IsFundedUnstaked;
  });

  if (!device) {
    return <ActivityIndicator size="small" />;
  }

  return (
    <>
      {isVNode
        ? renderUnstakeVNode()
        : renderUnstakePNode()
      }
    </>
  );
});

export default UnstakeContainer;
