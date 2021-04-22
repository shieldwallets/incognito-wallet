import React, { memo } from 'react';
import { ActivityIndicator, WebView } from '@components/core';
import { View } from 'react-native';
import enhance from '@screens/Node/MonitorDetail/MonitorDetail.enhance';
import { Header } from '@src/components';
import BottomBar from '@screens/Node/MonitorDetail/components/BottomBar';
import PropTypes from 'prop-types';
import styles from '@screens/Community/style';

let webviewInstance;
const MonitorDetail = memo((props) => {
  const { url } = props;
  const [loading, setLoading] = React.useState(true);

  const onReload = () => {
    if (!webviewInstance) return;
    webviewInstance?.reload();
  };

  const onGoBack = () => {
    if (!webviewInstance) return;
    webviewInstance?.goBack();
  };

  const onGoForward = () => {
    if (!webviewInstance) return;
    webviewInstance?.goForward();
  };

  const onPappLoaded = () => {
    setLoading(false);
  };

  return (
    <View style={{ marginHorizontal: 25, flex: 1 }}>
      <Header title="Monitor Detail" />
      <WebView
        ref={(webview) => {
          if (webview?.webViewRef?.current) {
            webviewInstance = webview;
          }
        }}
        containerStyle={{ flex: 1, paddingBottom: 70 }}
        source={{ uri: url }}
        allowsBackForwardNavigationGestures
        onLoad={(e) => {}}
        bounces
        cacheEnabled={false}
        cacheMode="LOAD_NO_CACHE"
        showsVerticalScrollIndicator={false}
        onLoadEnd={onPappLoaded}
      />
      {loading && <ActivityIndicator style={styles.loading} /> }
      <BottomBar onReload={onReload} onGoBack={onGoBack} onGoForward={onGoForward} />
    </View>

  );
});

MonitorDetail.propTypes = {
  url: PropTypes.string.isRequired
};


export default enhance(MonitorDetail);