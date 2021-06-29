import React from 'react';
import ErrorBoundary from '@components/ErrorBoundary';
import {CONSTANTS, INC_CONTRACT_ABI, TOKEN_ABI} from '@screens/Wallet/features/BridgeConnect/WalletConnect.constants';
import {useWalletConnect} from '@walletconnect/react-native-dapp';
import Web3 from 'web3';
import {compose} from 'recompose';
import withAccount from '@screens/DexV2/components/account.enhance';
import {CONSTANT_COMMONS} from '@src/constants';
import BigNumber from 'bignumber.js';
import {ExHandler} from '@services/exception';

const web3 = new Web3(CONSTANTS.ETH_HOST);
const web3BSC = new Web3(CONSTANTS.BSC_HOST);

const walletConnectEnhance = WrappedComp => props => {
  const connector = useWalletConnect();

  const handleDepositETH = async (depositAmount = 0.000001, address, incAddress, isBSC) => {
    const client = isBSC ? web3BSC : web3;
    const contractAddress = isBSC ? CONSTANTS.INC_BSC_CONTRACT_ADDRESS : CONSTANTS.INC_CONTRACT_ADDRESS;
    const ethAmt = new BigNumber(depositAmount).multipliedBy(1e18).toString();
    const incInstance = new client.eth.Contract(INC_CONTRACT_ABI);
    /** deposit ETH */
    const depData = incInstance.methods.deposit(incAddress).encodeABI();
    /** confirm send ETH  */
    const sendObject = {
      from: address,
      value: ethAmt,
      to: contractAddress,
      data: depData,
    };

    return await connector.sendTransaction(sendObject);
  };

  const isApprovedFunc = async (transferAmount = 0.0001, tokenID, address, isBSC) => {
    const client = isBSC ? web3BSC : web3;
    const contractAddress = isBSC ? CONSTANTS.INC_BSC_CONTRACT_ADDRESS : CONSTANTS.INC_CONTRACT_ADDRESS;
    const tokenInstance = new client.eth.Contract(TOKEN_ABI, tokenID);
    const approvedBalance = await tokenInstance.methods
      .allowance(address, contractAddress)
      .call();

    return transferAmount <= approvedBalance ? 1 : 0;
  };

  const handleApproveERC20 = async (tokenID, address, nonce, isBSC) => {
    const approveMax = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
    const client = isBSC ? web3BSC : web3;
    const tokenInstance = new client.eth.Contract(TOKEN_ABI, tokenID);
    const contractAddress = isBSC ? CONSTANTS.INC_BSC_CONTRACT_ADDRESS : CONSTANTS.INC_CONTRACT_ADDRESS;
    const approveData = await tokenInstance.methods
      .approve(contractAddress, approveMax)
      .encodeABI();

    return await connector.sendTransaction({
      from: address,
      to: tokenID,
      data: approveData,
      nonce,
    });
  };

  const handleDepositERC20 = async (transferAmount = 0.0001, tokenID, address, incAddress, nonce, isBSC) => {
    const client = isBSC ? web3BSC : web3;
    const tokenInstance = new client.eth.Contract(TOKEN_ABI, tokenID);
    const decimals = await tokenInstance.methods
      .decimals()
      .call();
    const transferValue =new BigNumber(transferAmount).multipliedBy(10 ** decimals).toString();
    const contractAddress = isBSC ? CONSTANTS.INC_BSC_CONTRACT_ADDRESS : CONSTANTS.INC_CONTRACT_ADDRESS;
    /** deposit ERC20 */
    const incInstance = new client.eth.Contract(INC_CONTRACT_ABI, contractAddress);
    const depData = incInstance.methods
      .depositERC20(tokenID, transferValue, incAddress)
      .encodeABI();
    /** confirm deposit transaction */
    const depositObj = {
      from: address,
      to: contractAddress,
      data: depData,
    };
    if (nonce !== -1) {
      depositObj.nonce = nonce;
      depositObj.gasLimit = CONSTANTS.ETH_ERC20_DEPOSIT_GAS;
    }

    return await connector.sendTransaction(depositObj);
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

  const handleGetNonce = async (address, isBSC) => {
    if (isBSC) {
      return await web3BSC.eth.getTransactionCount(address);
    }
    return await web3.eth.getTransactionCount(address);
  };

  const handleGetBalance = async (tokenID, address, isBSC) => {
    let balance;
    let decimals = 18;
    const client = isBSC ? web3BSC : web3;
    try {
      if (tokenID !== CONSTANT_COMMONS.ETH_TOKEN_ADDRESS) {
        const tokenInstance = new client.eth.Contract(TOKEN_ABI, tokenID);
        balance = await tokenInstance.methods
          .balanceOf(address)
          .call();

        decimals = await tokenInstance.methods
          .decimals()
          .call();
      } else {
        balance = await client.eth.getBalance(address);
      }
      return balance / (10 ** decimals);
    } catch (e) {
      new ExHandler(e).showErrorToast();
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
