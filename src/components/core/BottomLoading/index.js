import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator } from '@src/components/core';
import { hasNotch } from 'react-native-device-info';
import PropTypes from 'prop-types';

const styled = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginBottom: hasNotch() ? 30 : 0,
    position: 'relative',
  },

});

const BottomLoading = ({ loading }) => {
  if (!loading) return null;
  return (
    <View style={styled.container}>
      <ActivityIndicator />
    </View>
  );
};

BottomLoading.propTypes = {
  loading: PropTypes.bool.isRequired,
};


export default React.memo(BottomLoading);
