import React from 'react';
import ErrorBoundary from '@components/ErrorBoundary';
import {CONSTANTS, INC_CONTRACT_ABI, TOKEN_ABI} from '@screens/Wallet/features/BridgeConnect/WalletConnect.constants';
import {useWalletConnect} from '@walletconnect/react-native-dapp';
import Web3 from 'web3';
import {compose} from 'recompose';
import withAccount from '@screens/DexV2/components/account.enhance';
import {CONSTANT_COMMONS} from '@src/constants';
import BigNumber from 'bignumber.js';

const web3 = new Web3(CONSTANTS.ETH_HOST);

const walletConnectEnhance = WrappedComp => props => {
  const connector = useWalletConnect();

  const handleDepositETH = async (depositAmount = 0.000001, address, incAddress) => {
    const ethAmt = new BigNumber(depositAmount).multipliedBy(1e18).toString();
    const incInstance = new web3.eth.Contract(INC_CONTRACT_ABI);
    /** deposit ETH */
    const depData = incInstance.methods.deposit(incAddress).encodeABI();

    /** confirm send ETH  */
    const sendObject = {
      from: address,
      value: ethAmt,
      to: CONSTANTS.INC_CONTRACT_ADDRESS,
      data: depData,
    };
    return await connector.sendTransaction(sendObject);
  };

  const isApprovedFunc = async (transferAmount = 0.0001, tokenID, address) => {
    const tokenInstance = new web3.eth.Contract(TOKEN_ABI, tokenID);
    const approvedBalance = await tokenInstance.methods
      .allowance(address, CONSTANTS.INC_CONTRACT_ADDRESS)
      .call();
    return transferAmount <= approvedBalance ? 1 : 0;
  };

  const handleApproveERC20 = async (tokenID, address, nonce) => {
    const approveMax = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
    const tokenInstance = new web3.eth.Contract(TOKEN_ABI, tokenID);
    const approveData = await tokenInstance.methods
      .approve(CONSTANTS.INC_CONTRACT_ADDRESS, approveMax)
      .encodeABI();
    return await connector.sendTransaction({
      from: address,
      to: tokenID,
      data: approveData,
      nonce,
    });
  };

  const handleDepositERC20 = async (transferAmount = 0.0001, tokenID, address, incAddress, nonce) => {
    const tokenInstance = new web3.eth.Contract(TOKEN_ABI, tokenID);
    const decimals = await tokenInstance.methods
      .decimals()
      .call();
    const transferValue =new BigNumber(transferAmount).multipliedBy(10 ** decimals).toString();

    /** deposit ERC20 */
    const incInstance = new web3.eth.Contract(INC_CONTRACT_ABI, CONSTANTS.INC_CONTRACT_ADDRESS);
    const depData = incInstance.methods
      .depositERC20(tokenID, transferValue, incAddress)
      .encodeABI();

    /** confirm deposit transaction */
    const depositObj = {
      from: address,
      to: CONSTANTS.INC_CONTRACT_ADDRESS,
      data: depData,
    };
    if (nonce !== -1) {
      depositObj.nonce = nonce;
      depositObj.gasLimit = CONSTANTS.ETH_ERC20_DEPOSIT_GAS;
    }
    const tx = await connector.sendTransaction(depositObj);
    return tx;
  };

  const handleConnect = async () => {
    try {
      if (!connector.connected) {
        await connector.connect();
      }
      return true;
    } catch (e) {
      console.debug('HANDLE CONNECT ERROR: ', e);
      return false;
    }
  };

  const handleGetNonce = async (address) => {
    return await web3.eth.getTransactionCount(address);
  };

  const handleGetBalance = async (tokenID, address) => {
    let balance;
    let decimals = 18;
    try {
      if (tokenID !== CONSTANT_COMMONS.ETH_TOKEN_ADDRESS) {
        const tokenInstance = new web3.eth.Contract(TOKEN_ABI, tokenID);
        balance = await tokenInstance.methods
          .balanceOf(address)
          .call();

        decimals = await tokenInstance.methods
          .decimals()
          .call();
      } else {
        balance = await web3.eth.getBalance(address);
      }
      return balance / (10 ** decimals);
    } catch (e) {
      console.debug('HANDLE GET BALANCE ERROR: ', e);
      return 0;
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
          handleDepositERC20,
          handleDepositETH,
          handleConnect,
          handleDisconnect,
          handleGetBalance,
          isApprovedFunc,
          handleApproveERC20,
          handleGetNonce,
        }}
      />
    </ErrorBoundary>
  );
};

export default compose(
  withAccount,
  walletConnectEnhance
);
