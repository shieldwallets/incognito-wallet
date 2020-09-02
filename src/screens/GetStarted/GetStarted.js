import { Text, View, Button } from '@src/components/core';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import style from './style';

class GetStarted extends Component {
  render() {
    const { isInitialing, errorMsg, isCreating, onRetry } = this.props;
    return (
      <View style={style.container}>
        {isInitialing && (
          <View style={style.loadingContainer}>
            <ActivityIndicator size="large" color="#828282" />
          </View>
        )}
        <View style={style.getStartedBlock}>
          <Text style={[style.title, style.centerText]}>
            {isCreating
              ? 'Generating your keychain...\nGive it a few seconds.'
              : 'Entering incognito mode\nfor your crypto...'}
          </Text>

          {errorMsg && (
            <Text style={[style.errorMsg, style.centerText]}>{errorMsg}</Text>
          )}
          {errorMsg && (
            <Button style={style.retryBtn} title="Retry" onPress={onRetry} />
          )}
        </View>
      </View>
    );
  }
}

GetStarted.defaultProps = {
  errorMsg: null,
  isInitialing: true,
  isCreating: false,
  onRetry: null,
};

GetStarted.propTypes = {
  errorMsg: PropTypes.string,
  isInitialing: PropTypes.bool,
  isCreating: PropTypes.bool,
  onRetry: PropTypes.func,
};

export default GetStarted;
