import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator } from '@src/components/core';
import PropTypes from 'prop-types';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const LoadingContainer = (props) => {
  const { containerStyled, custom } = props;
  return (
    <View style={[styled.container, containerStyled]}>
      <ActivityIndicator size={props?.size || 'small'} />
      {custom && custom}
    </View>
  );
};

LoadingContainer.propTypes = {
  containerStyled: null,
  custom: null,
};

export default React.memo(LoadingContainer);
