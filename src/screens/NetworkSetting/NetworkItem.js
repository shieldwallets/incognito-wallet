/* eslint-disable import/no-cycle */
import { Text, TouchableOpacity, View } from '@src/components/core';
import PropTypes from 'prop-types';
import React from 'react';
import isEqual from 'lodash/isEqual';
import { generateTestId } from '@utils/misc';
import { TEST_NETWORK } from '@src/constants/elements';
import { networkItemStyle } from './NetworkSetting.styled';

const NetworkItem = ({ active, network, onActive }) => {
  const [clickTime, setClickTime] = React.useState(0);
  return (
    <TouchableOpacity
      accessible={false}
      onPress={() => {
        const currClickTime = clickTime + 1;
        setClickTime(currClickTime);
        if (currClickTime === 7) {
          global.isDEV = true;
        } else if (
          (__DEV__ || !!global.isDEV) &&
          !isEqual(network?.id, 'local')
        ) {
          onActive();
        }
      }}
    >
      <View
        style={[
          networkItemStyle.container,
          active && networkItemStyle.activeItem,
        ]}
        accessible={false}
      >
        <View style={networkItemStyle.circle} />
        <View accessible={false} style={networkItemStyle.textInfoContainer}>
          <Text
            style={networkItemStyle.networkName}
            numberOfLines={1}
            ellipsizeMode="tail"
            {...generateTestId(TEST_NETWORK.LBL_NETWORK)}
          >
            {network?.name}
          </Text>
          <Text
            style={networkItemStyle.networkAddr}
            numberOfLines={1}
            ellipsizeMode="tail"
            {...generateTestId(TEST_NETWORK.LBL_NETWORK_URL)}
          >
            {network?.address}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const networkItemShape = PropTypes.shape({
  id: PropTypes.string,
  default: PropTypes.bool,
  name: PropTypes.string,
  address: PropTypes.string,
  username: PropTypes.string,
  password: PropTypes.string,
});

NetworkItem.defaultProps = {
  active: false,
  expanded: false,
  onActive: undefined,
  onExpand: undefined,
};

NetworkItem.propTypes = {
  network: networkItemShape.isRequired,
  active: PropTypes.bool,
  expanded: PropTypes.bool,
  onActive: PropTypes.func,
  onExpand: PropTypes.func,
};

export default NetworkItem;
