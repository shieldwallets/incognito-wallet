import React from 'react';
import ErrorBoundary from '@components/ErrorBoundary';
import { Button } from '@components/Button';
import {CONSTANTS, INC_CONTRACT_ABI, TOKEN_ABI} from '@screens/Wallet/features/BridgeConnect/WalletConnect.constants';
import { useWalletConnect, WalletService } from '@walletconnect/react-native-dapp';
import Web3 from 'web3';

const web3 = new Web3('wss://kovan.infura.io/ws/v3/eb59e8ee9b6e476c90df7b05fab63e4a');

const walletConnectEnhance = WrappedComp => props => {
  const connector = useWalletConnect();
  const [accounts, setAccounts] = React.useState(connector.accounts);
  const handleDepositETH = async (depositAmount = 0.000001) => {
    const ethAmt = `0x${(depositAmount * 1e18).toString(16)}`;
    const incInstance = new web3.eth.Contract(INC_CONTRACT_ABI);

    /** deposit ETH */
    const depData = incInstance.methods.deposit(CONSTANTS.INC_ADDRESS).encodeABI();

    /** confirm send ETH  */
    const sendObject = {
      from: accounts[0],
      value: ethAmt,
      to: accounts[0], // CONSTANTS.INC_CONTRACT_ADDRESS
      data: depData,
    };
    // Todo: save tx local
    const tx = await connector.sendTransaction(sendObject);
    console.log('SEND TRANSACTION WITH TX: ', tx);
  };

  const handleDepositERC20 = async (transferAmount = 0.0001) => {
    const tokenContractID = CONSTANTS.TOKEN_CONTRACT_ID;
    const approveMax = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
    const transferValue = web3.utils.toHex(transferAmount * 1e18);
    const tokenInstance = new web3.eth.Contract(TOKEN_ABI, tokenContractID);
    const approvedBalance = await tokenInstance.methods
      .allowance(accounts[0], CONSTANTS.INC_CONTRACT_ADDRESS)
      .call();

    if (transferAmount > approvedBalance) {
      const approveData = await tokenInstance.methods
        .approve(CONSTANTS.INC_CONTRACT_ADDRESS, approveMax)
        .encodeABI();
      const approveTx = await connector.sendTransaction({
        from: accounts[0],
        to: tokenContractID,
        data: approveData,
      });
      // Todo: save approve tx
      console.log(approveTx);
    }

    /** deposit ERC20 */
    const incInstance = new web3.eth.Contract(INC_CONTRACT_ABI, CONSTANTS.INC_CONTRACT_ADDRESS);
    const depData = incInstance.methods
      .depositERC20(tokenContractID, transferValue, CONSTANTS.INC_ADDRESS)
      .encodeABI();

    /** confirm deposit transaction */
    const depositObj = {
      from: accounts[0],
      to: CONSTANTS.INC_CONTRACT_ADDRESS,
      value: 0,
      data: depData,
    };

    const tx = await connector.sendTransaction(depositObj);
    console.log(tx);
  };

  const handleConnect = async () => {
    try {
      if (!connector.connected) {
        const connectResult = await connector.connect();
        setAccounts(connectResult.accounts);
        return;
      }
      // handleDepositETH().then();
      handleDepositERC20().then();
    } catch (e) {
      console.debug('HANDLE CONNECT ERROR: ', e);
    }
  };

  const handleDisconnect = async () => {
    await connector.killSession();
  };

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
        }}
      />
    </ErrorBoundary>
  );
};

export default walletConnectEnhance;
