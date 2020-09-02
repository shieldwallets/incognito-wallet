import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { THEME } from '@src/styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.header.backgroundColor,
  }
});

const AppScreen = ({ children }) => {
  if (!children) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} forceInset={{ top: 'never', bottom: 'never' }}>
      {children}
    </SafeAreaView>
  );
};

AppScreen.propTypes = {
  children: PropTypes.oneOfType([ PropTypes.element, PropTypes.arrayOf(PropTypes.element) ]).isRequired
};

export default AppScreen;
