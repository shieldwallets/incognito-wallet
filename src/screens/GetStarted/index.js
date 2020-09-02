import { login } from '@src/services/auth';
import { CONSTANT_CONFIGS } from '@src/constants';
import { reloadWallet, reloadAccountList } from '@src/redux/actions/wallet';
import { followDefaultTokens } from '@src/redux/actions/account';
import { getPTokenList } from '@src/redux/actions/token';
import { accountSeleclor } from '@src/redux/selectors';
import { CustomError, ErrorCode } from '@src/services/exception';
import { savePassword } from '@src/services/wallet/passwordService';
import serverService from '@src/services/wallet/Server';
import { initWallet } from '@src/services/wallet/WalletService';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import routeNames from '@routers/routeNames';
import GetStarted from './GetStarted';

class GetStartedContainer extends Component {
  constructor() {
    super();

    this.state = {
      isInitialing: true,
      isCreating: false,
      errorMsg: null,
    };
  }

  componentDidMount() {
    this.initApp();
  }

  goHome = async () => {
    const { navigation } = this.props;
    navigation.navigate(routeNames.Wallet);
  };

  getExistedWallet = async () => {
    try {
      const { reloadWallet } = this.props;
      const wallet = await reloadWallet(
        CONSTANT_CONFIGS.PASSPHRASE_WALLET_DEFAULT,
      );
      if (wallet) {
        return wallet;
      }
      return null;
    } catch (e) {
      throw new CustomError(ErrorCode.wallet_can_not_load_existed_wallet, {
        rawError: e,
      });
    }
  };

  initApp = async () => {
    this.setState({ isInitialing: true });
    const serverLocalList = (await serverService.get()) ?? [];
    await login();
    if (!serverLocalList || serverLocalList.length === 0) {
      await serverService.setDefaultList();
    }

    const wallet = await this.getExistedWallet();

    // loaded wallet & then continue to Wallet screen
    if (!wallet) {
      this.setState({ isCreating: true });
      // create new Wallet
      await this.handleCreateNew();
    }

    this.setState({ isInitialing: false, isCreating: false });
    this.goHome();
  };

  handleCreateWallet = async () => {
    try {
      await savePassword(CONSTANT_CONFIGS.PASSPHRASE_WALLET_DEFAULT);
      return initWallet();
    } catch (e) {
      throw new CustomError(ErrorCode.wallet_can_not_create_new_wallet, {
        rawError: e,
      });
    }
  };

  handleCreateNew = async () => {
    await this.handleCreateWallet();
    this.goHome();
  };

  handleRytry = () => {
    this.initApp();
    this.setState({ errorMsg: null, isInitialing: true });
  };

  render() {
    const { isInitialing, errorMsg, isCreating } = this.state;
    return (
      <GetStarted
        errorMsg={errorMsg}
        isInitialing={isInitialing}
        isCreating={isCreating}
        onRetry={this.handleRytry}
      />
    );
  }
}

const mapDispatch = {
  reloadWallet,
  getPTokenList,
  followDefaultTokens,
  reloadAccountList,
};

const mapState = state => ({
  account: accountSeleclor.defaultAccount(state),
});

GetStartedContainer.propTypes = {
  reloadWallet: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
};

export default connect(
  mapState,
  mapDispatch,
)(GetStartedContainer);
