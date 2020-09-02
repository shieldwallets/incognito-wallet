import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { UTILS, COLORS } from '@src/styles';
import { isIOS } from '@src/utils/platform';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: UTILS.screenHeight(),
    backgroundColor: COLORS.white,
  },
  wrapper: {
    margin: 25,
    flex: 1,
    marginTop: 0,
  },
});

const enhance = (WrappedComp) => (props) => {
  const ios = isIOS();
  return (
    <ErrorBoundary>
      <SafeAreaView
        style={[styled.container, ios, props?.containerStyled]}
      >
        <View style={[styled.wrapper, props?.wrapperStyled]}>
          <WrappedComp {...props} />
        </View>
      </SafeAreaView>
    </ErrorBoundary>
  );
};

export default enhance;
