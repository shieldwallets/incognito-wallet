import React from 'react';
import { Image, Modal, Text, TouchableOpacity, View } from 'react-native';

const BridgeConnectSheet = (props) => {
  const { walletServices, visible, connectToWalletService, uri } = props;
  const renderContent = React.useCallback(() => {
    return walletServices.map((walletService, i) => (
      <TouchableOpacity key={`i${i}`} onPress={() => connectToWalletService(walletService, uri)}>
        <Image source={{ uri: walletService.logo }} />
        <Text>{walletService.name}</Text>
      </TouchableOpacity>
    ));
  }, [walletServices, uri]);
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
    >
      <View>{renderContent()}</View>
    </Modal>
  );
};

export default BridgeConnectSheet;
