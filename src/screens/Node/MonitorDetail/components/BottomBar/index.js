import React, { memo } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import styles from '@screens/PappView/style';
import { TouchableOpacity } from '@components/core';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '@src/styles';

const BottomBar = (props) => {
  const { onGoForward, onGoBack, onReload } = props;
  return (
    <View style={styles.navigation}>
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <TouchableOpacity onPress={onGoBack} style={styles.back}>
          <Ionicons
            name="ios-arrow-back"
            size={30}
            color={COLORS.colorGreyBold}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onGoForward}
          style={styles.back}
        >
          <Ionicons
            name="ios-arrow-forward"
            size={30}
            color={COLORS.colorGreyBold}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.back} />
        <TouchableOpacity onPress={onReload} style={styles.back}>
          <Ionicons
            name="ios-refresh"
            size={30}
            color={COLORS.colorGreyBold}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

BottomBar.propTypes = {
  onGoForward: PropTypes.func.isRequired,
  onReload: PropTypes.func.isRequired,
  onGoBack: PropTypes.func.isRequired,
};


export default memo(BottomBar);