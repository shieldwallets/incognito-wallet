import React from 'react';
import PropTypes from 'prop-types';
import Offline from '@screens/Node/components/NodeStatus/Offline';
import Status from '@screens/Node/components/NodeStatus/Status';
import Unstaking from '@screens/Node/components/NodeStatus/Unstaking';
import Working from '@screens/Node/components/NodeStatus/Working';
import Waiting from '@screens/Node/components/NodeStatus/Waiting';

const NodeStatus = ({ item }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const isOffline = item.IsOffline;
  const isWorking = item.IsWorking;
  const isUnstaking = item.IsUnstaking;
  const color = item.StatusColor;

  const noNeedToShowForUnstaked = !item.IsStaked && !item.IsUnstaking;

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  if (noNeedToShowForUnstaked) {
    return null;
  }

  if (isOffline) {
    return (
      <>
        <Status value="Offline" color={color} isExpanded={isExpanded} onToggle={handleToggle} />
        {!isExpanded && <Offline isVNode={item.IsVNode} ip={item.Host} />}
      </>
    );
  }

  if (isUnstaking) {
    return (
      <>
        <Status value="Unstaking" color={color} isExpanded={isExpanded} onToggle={handleToggle} />
        {isExpanded && <Unstaking />}
      </>
    );
  }

  if (isWorking) {
    return (
      <>
        <Status value="Creating" color={color} isExpanded={isExpanded} onToggle={handleToggle} />
        {isExpanded && <Working />}
      </>
    );
  }

  return (
    <>
      <Status value="Waiting" color={color} isExpanded={isExpanded} onToggle={handleToggle} />
      {isExpanded && <Waiting />}
    </>
  );
};

NodeStatus.propTypes = {
  item: PropTypes.object.isRequired,
};

export default NodeStatus;

