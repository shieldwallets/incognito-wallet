import React, { memo } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { styled } from '@screens/Shield/features/GenQRCode/GenQRCode.styled';
import { ActivityIndicator, BaseTextInput, RoundCornerButton } from '@components/core';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import { CONSTANT_COMMONS } from '@src/constants';
import withBridgeConnect from '@screens/Wallet/features/BridgeConnect/WalletConnect.enhance';
import { useSelector } from 'react-redux';
import { selectedPrivacySeleclor } from '@src/redux/selectors';
import { ExHandler } from '@services/exception';
import { useNavigation } from 'react-navigation-hooks';
import { isEmpty } from 'lodash';
import { BtnInfinite, ButtonBasic } from '@components/Button';
import {
  SHIELD_BUTTON_TITLE,
  SHIELD_MESSAGE
} from '@screens/Shield/features/ShieldDecentralized/ShieldDecentralized.constants';
import mainStyle from '@screens/PoolV2/style';
import {Row, Header, SuccessModal} from '@src/components';
import ExtraInfo from '@screens/DexV2/components/ExtraInfo';
import styles from '@screens/PoolV2/Provide/Input/style';
import routeNames from '@routers/routeNames';

const ShieldDecentralized = (props) => {
  const {
    account,
    handleGetBalance,
    handleDisconnect,
    handleConnect,
    handleDepositETH,
    isApprovedFunc,
    handleApproveERC20,
    handleDepositERC20,
    handleGetNonce,
    setShowTerm,
  } = props;

  // state
  const [balanceLoaded, setLoadBalance] = React.useState(undefined);
  const [shieldAmount, setShieldAmount] = React.useState('');
  const [shieldTxHash, setShieldTxHash] = React.useState(undefined);
  const [isPressed, setIsPressed] = React.useState(false);
  const [isRejected, setIsRejected] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);

  const navigation = useNavigation();
  // selector
  const connector = useWalletConnect();
  const { externalSymbol, contractId } = useSelector(selectedPrivacySeleclor.selectedPrivacy);

  const tokenIDInput = React.useMemo(() => {
    return contractId ? contractId : CONSTANT_COMMONS.ETH_TOKEN_ADDRESS;
  }, [contractId]);

  const isConnect = React.useMemo(() => {
    return connector.connected && connector.accounts && connector.accounts.length > 0;
  }, [connector]);

  const shieldButtonText = React.useMemo(() => {
    if (!isConnect) return SHIELD_BUTTON_TITLE.CONNECT;
    return externalSymbol === CONSTANT_COMMONS.CRYPTO_SYMBOL.ETH
      ? SHIELD_BUTTON_TITLE.SHIELD
      : SHIELD_BUTTON_TITLE.APPROVE_SHIELD;
  }, [externalSymbol, isConnect]);

  const handleShield = () => {
    setIsPressed(true);
    const convertShieldAmount = shieldAmount.replace(',', '.');
    let shieldAmountNum = parseFloat(convertShieldAmount);
    if (connector.accounts.length > 0 && shieldAmountNum <= balanceLoaded) {
      (async () => {
        let tx;
        let nonce = -1;
        try {
          if (externalSymbol === CONSTANT_COMMONS.CRYPTO_SYMBOL.ETH) {
            tx = await handleDepositETH(shieldAmountNum, connector.accounts[0], account?.PaymentAddress);
            setShieldTxHash(tx);
          } else {
            const isApproved = await isApprovedFunc(shieldAmountNum, tokenIDInput, connector.accounts[0]);
            if (!isApproved) {
              nonce = await handleGetNonce(connector.accounts[0]);
              await handleApproveERC20(tokenIDInput, connector.accounts[0], nonce++);
            }
            tx = await handleDepositERC20(shieldAmountNum, tokenIDInput, connector.accounts[0], account?.PaymentAddress, nonce);
            setIsRejected(false);
            setShieldTxHash(tx);
          }
        } catch (e) {
          const errMess = e.message;
          if (errMess.toLowerCase().indexOf('user rejected') !== -1) {
            setIsRejected(true);
          } else {
            new ExHandler().showErrorToast();
          }
        }
      })();
      setTimeout(
        () => {setIsPressed(false);},
        1500
      );
    } else {
      console.log('Wallet not connected or invalid input amount');
      setIsPressed(false);
    }
  };

  const web3LoadBalance = async () => {
    const balance = await handleGetBalance(tokenIDInput, connector.accounts[0]);
    setLoadBalance(balance);
  };

  const onMainBtnPress = () => {
    if (isConnect) {
      return handleShield();
    }
    if (typeof handleConnect === 'function') {
      handleConnect();
    }
  };

  const onCloseSuccessModel = () => {
    setShieldTxHash(false);
    navigation.navigate(routeNames.WalletDetail);
  };

  const renderBalance = () => {
    if (!balanceLoaded) {
      web3LoadBalance();
    }
    const right = balanceLoaded === undefined ?
      (
        <View style={{ maxWidth: 50, alignSelf: 'flex-end' }}>
          <ActivityIndicator size="small" />
        </View>
      ) :
      `${balanceLoaded} ${externalSymbol}`;
    return(
      <ExtraInfo
        left="Balance"
        right={right}
        style={styles.extra}
      />
    );
  };

  const renderContent = () => (
    <View style={{ marginTop: 20 }}>
      <Row center spaceBetween style={mainStyle.inputContainer}>
        <BaseTextInput
          style={mainStyle.input}
          placeholder="0"
          onChangeText={amount => setShieldAmount(amount)}
          value={shieldAmount}
          editable={isConnect}
          keyboardType="decimal-pad"
        />
        <BtnInfinite
          onPress={() => {
            if (!balanceLoaded) return;
            setShieldAmount(`${balanceLoaded}`);
          }}
          style={[mainStyle.symbol, !balanceLoaded && { opacity: 0.4 }]}
        />
      </Row>
      <RoundCornerButton
        onPress={onMainBtnPress}
        title={shieldButtonText}
        style={styled.btnShield}
        disabled={isPressed}
      />
      <View style={styled.wrapMessage}>
        {!isEmpty(shieldTxHash) && (
          <SuccessModal
            closeSuccessDialog={onCloseSuccessModel}
            title={SHIELD_MESSAGE.SHIELD_SUCCESS_TITLE}
            buttonTitle="Sure thing"
            buttonStyle={mainStyle.button}
            visible={!!shieldTxHash}
            description={SHIELD_MESSAGE.SHIELD_SUCCESS_MESS}
          />
        )}
        { isRejected && (
          <Text style={styled.shieldMessage}>
            {SHIELD_MESSAGE.REJECTED_MESS}
          </Text>
        )}
      </View>
      <View style={{ marginTop: 15 }}>
        {isConnect && (
          <>
            <ExtraInfo
              left="Address"
              right={connector.accounts[0]}
              style={styles.extra}
              rightStyle={{ maxWidth: 200 }}
              ellipsizeMode='middle'
            />
            {renderBalance()}
          </>
        )}
      </View>
    </View>
  );

  const onConnectorPress = () => {
    if (typeof handleConnect === 'function' && typeof handleDisconnect === 'function') {
      if (isConnect) {
        handleDisconnect();
        setShowTerm(true);
      } else {
        handleConnect();
      }
    }
  };

  const renderRightHeader = () => {
    if (!isConnect) return null;
    return(
      <View styles={styled.wrapConnect}>
        <ButtonBasic
          onPress={onConnectorPress}
          customContent={(
            <View style={styled.connectHook}>
              <Text numberOfLines={1} style={styled.connectStyle} ellipsizeMode="tail">
                {SHIELD_BUTTON_TITLE.DISCONNECT}
              </Text>
            </View>
          )}
          btnStyle={styled.btnConnect}
        />
      </View>
    );
  };

  const handleRefresh = async () => {
    if (!connector || connector.connected || isEmpty(connector.accounts)) return;
    try {
      setRefresh(true);
      setLoadBalance(undefined);
      await web3LoadBalance();
    } catch (error) {
      console.log('Web3 load balance error: ', error);
    } finally {
      setRefresh(false);
    }
  };

  React.useEffect(() => {
    if (!connector || connector.connected || isEmpty(connector.accounts)) return;
    web3LoadBalance().then();
  }, [connector, tokenIDInput]);

  return (
    <ScrollView
      refreshControl={(
        <RefreshControl
          refreshing={refresh}
          onRefresh={handleRefresh}
        />
      )}
    >
      <View style={{ flex: 1 }}>
        <Header
          title={`Shield ${externalSymbol}`}
          rightHeader={renderRightHeader()}
        />
        {renderContent()}
      </View>
    </ScrollView>
  );
};

ShieldDecentralized.propTypes = {
  account: PropTypes.object.isRequired,
  handleGetBalance: PropTypes.func.isRequired,
  handleDisconnect: PropTypes.func.isRequired,
  handleConnect: PropTypes.func.isRequired,
  handleDepositETH: PropTypes.func.isRequired,
  isApprovedFunc: PropTypes.bool.isRequired,
  handleApproveERC20: PropTypes.func.isRequired,
  handleDepositERC20: PropTypes.func.isRequired,
  handleGetNonce: PropTypes.func.isRequired,
  setShowTerm: PropTypes.func.isRequired,
};

export default withBridgeConnect(memo(ShieldDecentralized));
