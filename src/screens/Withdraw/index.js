import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text } from '@src/components/core';
import LoadingContainer from '@src/components/LoadingContainer';
import { connect } from 'react-redux';
import { genWithdrawAddress } from '@src/services/api/withdraw';
import tokenService from '@src/services/wallet/tokenService';
import { CONSTANT_COMMONS } from '@src/constants';
import { messageCode, createError } from '@src/services/errorHandler';
import { getMaxWithdrawAmountService } from '@src/services/wallet/RpcClientService';
import { getBalance as getTokenBalance } from '@src/redux/actions/token';
import { accountSeleclor, selectedPrivacySeleclor } from '@src/redux/selectors';
import convertUtil from '@src/utils/convert';
import tokenData from '@src/constants/tokenData';
import Withdraw from './Withdraw';

class WithdrawContainer extends Component {
  constructor() {
    super();

    this.state = {
      withdrawData: null,
    };
  }

  componentDidMount() {
    this.getWithdrawData();
  }

  getTokenObject = ({ amount }) => {
    const { selectedPrivacy } = this.props;
    const fromAddress = selectedPrivacy?.paymentAddress;
    const toAddress = fromAddress; // est fee on the same network, dont care which address will be send to
    const originalAmount = convertUtil.toOriginalAmount(Number(amount), selectedPrivacy?.decimals);

    const tokenObject = {
      Privacy: true,
      TokenID: selectedPrivacy?.tokenId,
      TokenName: selectedPrivacy?.name,
      TokenSymbol: selectedPrivacy?.symbol,
      TokenTxType: CONSTANT_COMMONS.TOKEN_TX_TYPE.SEND,
      TokenAmount: originalAmount,
      TokenReceivers: {
        PaymentAddress: toAddress,
        Amount: originalAmount
      }
    };

    return tokenObject;
  }

  getWithdrawData = async () => {
    const { account, wallet, selectedPrivacy } = this.props;
    const fromAddress = selectedPrivacy?.paymentAddress;
    const toAddress = fromAddress; // est fee on the same network, dont care which address will be send to
    const accountWallet = wallet.getAccountByName(account?.name);
    const selectedPrivacyAmount = selectedPrivacy?.amount;

    if (selectedPrivacyAmount <= 0) {
      return throw createError({ code: messageCode.code.balance_must_not_be_zero });
    }

    const tokenObject = this.getTokenObject({ amount: 0 });

    try{
      const data = await getMaxWithdrawAmountService(
        fromAddress,
        toAddress,
        tokenObject,
        account?.PrivateKey,
        accountWallet,
      );

      this.setState({ withdrawData: data });
    } catch {
      throw new Error('Get withdraw data error');
    }
  }

  onSendToken = async ({ tempAddress, amount, fee, feeUnit }) => {
    const { withdrawData: { feeForBurn } } = this.state;
    const { account, wallet, tokens, selectedPrivacy, getTokenBalanceBound } = this.props;
    const type = CONSTANT_COMMONS.TOKEN_TX_TYPE.SEND;
    const originalFee = Number(fee);
    const originalAmount = convertUtil.toOriginalAmount(Number(amount), selectedPrivacy?.decimals);
    const isTokenFee = feeUnit !== tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY;

    const tokenObject = {
      Privacy : true,
      TokenID: selectedPrivacy?.tokenId,
      TokenName: selectedPrivacy?.name,
      TokenSymbol: selectedPrivacy?.symbol,
      TokenTxType: type,
      TokenAmount: originalAmount + (isTokenFee ? feeForBurn : 0),
      TokenReceivers: {
        PaymentAddress: tempAddress,
        Amount: originalAmount + (isTokenFee ? feeForBurn : 0)
      }
    };

    const paymentInfo = {
      paymentAddressStr: tempAddress,
      amount: feeForBurn,
    };

    try {
      const res = await tokenService.createSendPrivacyCustomToken(
        tokenObject,
        !isTokenFee ? originalFee : 0,
        account,
        wallet,
        !isTokenFee  ? paymentInfo : null,
        isTokenFee ? originalFee : 0
      );

      if (res.txId) {
        const foundToken = tokens.find(t => t.id === selectedPrivacy?.tokenId);
        foundToken && setTimeout(() => getTokenBalanceBound(foundToken), 10000);

        return res;
      } else {
        throw new Error(`Send token failed. Please try again! Detail: ${res.err.Message || res.err }`);
      }
    } catch (e) {
      throw new Error(`Send token failed. Please try again! Detail:' ${e.message}`);
    }
  }

  getWithdrawAddress = async ({ amount, paymentAddress }) => {
    try {
      const { selectedPrivacy } = this.props;
      const currencyType = CONSTANT_COMMONS.CURRENCY_TYPE_FOR_GEN_ADDRESS[selectedPrivacy?.externalSymbol];
      const walletAddress = selectedPrivacy?.paymentAddress;
      const address = await genWithdrawAddress({
        currencyType,
        amount,
        paymentAddress,
        walletAddress
      });
      return address;
    } catch (e) {
      throw createError({ code: messageCode.code.gen_withdraw_address_failed });
    }
  }

  render() {
    const { selectedPrivacy } = this.props;
    const { withdrawData } = this.state;

    if (selectedPrivacy && selectedPrivacy?.amount <= 0) {
      return <Text style={{ padding: 20, textAlign: 'center'}}>Please deposit more {selectedPrivacy?.symbol} to your wallet.</Text>;
    }

    if (!selectedPrivacy || !withdrawData) return <LoadingContainer />;

    return (
      <Withdraw
        {...this.props}
        withdrawData={withdrawData}
        handleGenAddress={this.getWithdrawAddress}
        handleSendToken={this.onSendToken}
      />
    );
  }
}

const mapState = state => ({
  tokens: state.token?.followed,
  selectedPrivacy: selectedPrivacySeleclor.selectedPrivacy(state),
  wallet: state.wallet,
  account: accountSeleclor.defaultAccount(state)
});

const mapDispatch = { getTokenBalanceBound: getTokenBalance };

WithdrawContainer.defaultProps = {
  selectedPrivacy: null,
};

WithdrawContainer.propTypes = {
  selectedPrivacy: PropTypes.object,
};


export default connect(
  mapState,
  mapDispatch
)(WithdrawContainer);
