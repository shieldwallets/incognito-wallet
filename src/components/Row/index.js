import React from 'react';
import PropTypes from 'prop-types';
import { View } from '@components/core';
import styles from './style';

const Row = ({
  style,
  center,
  children,
}) => (
  <View style={[styles.row, center && styles.center, style]}>
    {children}
  </View>
);

Row.propTypes = {
  style: PropTypes.object,
  center: PropTypes.bool,
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
};

Row.defaultProps = {
  style: null,
  center: false,
};

export default Row;
