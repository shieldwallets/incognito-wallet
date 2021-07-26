import LoadingContainer from '@src/components/LoadingContainer';
import { getBalance, getInternalTokenList, getPTokenList, setListToken } from '@src/redux/actions/token';
import { setDefaultAccount } from '@src/redux/actions/account';
import { addHistory, getHistories, updateHistory, getHistoryStatus, updatePairs } from '@src/redux/actions/dex';
import { setSelectedPrivacy } from '@src/redux/actions/selectedPrivacy';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MESSAGES } from '@screens/Dex/constants';
import { ExHandler } from '@services/exception';
import { accountSelector, selectedPrivacySelector } from '@src/redux/selectors';
import { listAllMasterKeyAccounts } from '@src/redux/selectors/masterKey';
import { reloadAccountList } from '@src/redux/actions/wallet';
import { accountServices } from '@services/wallet';
import Dex from './Dex';

class DexContainer extends Component {
  state = {
    // dexMainAccount: {},
    // dexWithdrawAccount: {},
    tokens: [],
    pairTokens: [],
    pairs: [],
    loading: false,
  };

  async componentDidMount() {
    const { wallet, reloadAccountList } = this.props;
    const accounts = (await wallet.listAccount())
      .map(item => ({
        ...item,
        Wallet: wallet,
      }));

    // const dexMainAccount = accounts.find(item => item.AccountName.toLowerCase() === DEX.MAIN_ACCOUNT.toLowerCase());
    // const dexWithdrawAccount = accounts.find(item => item.AccountName.toLowerCase() === DEX.WITHDRAW_ACCOUNT.toLowerCase());

    // if (!dexMainAccount || !dexWithdrawAccount) {
    //   await createDefaultAccounts(wallet);
    //   await saveWallet(wallet);
    //   await reloadAccountList();
    // }
    this.loadData();
  }

  componentWillUnmount() {
    clearInterval(this.interval);

    if (this.listener) {
      this.listener.remove();
      this.listener = null;
    }
  }

  async updateAccount() {
    const { wallet } = this.props;
    const accounts = (await wallet.listAccount())
      .map(item => ({
        ...item,
        Wallet: wallet,
      }));
    // const dexMainAccount = accounts.find(item => item.AccountName.toLowerCase() === DEX.MAIN_ACCOUNT.toLowerCase());
    // const dexWithdrawAccount = accounts.find(item => item.AccountName.toLowerCase() === DEX.WITHDRAW_ACCOUNT.toLowerCase());
    this.setState({ masterKeyAccounts: accounts });
  }

  loadData = async () => {
    const { getHistories, navigation, updatePairs, account, wallet } = this.props;
    const { loading } = this.state;

    if (!this.listener) {
      this.listener = navigation.addListener('didFocus', this.loadData);
    }

    if (loading) {
      return;
    }

    try {
      await this.updateAccount();
      getHistories();
      this.setState({ loading: true });
      const {
        pairs,
        pairTokens,
        tokens,
        shares
      } = await accountServices.getPairs({ account, wallet });

      // if (!_.has(chainPairs, 'state.PDEPoolPairs')) {
      //   throw new CustomError(ErrorCode.FULLNODE_DOWN);
      // }

      this.setState({ pairs, pairTokens, tokens, shares });
      updatePairs(pairs);
    } catch(error) {
      new ExHandler(error).showErrorToast();
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const {
      wallet,
      navigation,
      histories,
      addHistory,
      updateHistory,
      getHistoryStatus,
      getHistories,
      account,
      selectPrivacyByTokenID,
      accounts,
    } = this.props;
    const {
      tokens,
      pairTokens,
      pairs,
      loading,
      shares,
      masterKeyAccounts,
    } = this.state;

    if (!wallet) {
      return (
        <LoadingContainer />
      );
    }

    return (
      <Dex
        wallet={wallet}
        navigation={navigation}
        histories={histories}
        onAddHistory={addHistory}
        onUpdateHistory={updateHistory}
        onGetHistoryStatus={getHistoryStatus}
        onGetHistories={getHistories}
        onSelectPrivacyByTokenID={selectPrivacyByTokenID}
        dexMainAccount={account}
        dexWithdrawAccount={account}
        accounts={accounts}
        tokens={tokens}
        pairTokens={pairTokens}
        pairs={pairs}
        onLoadData={this.loadData}
        isLoading={loading}
        account={account}
        shares={shares}
        masterKeyAccounts={masterKeyAccounts}
      />
    );
  }
}

const mapState = state => ({
  account: accountSelector.defaultAccount(state),
  wallet: state.wallet,
  histories: state.dex.histories.filter(item => item.type !== MESSAGES.TRADE),
  selectPrivacyByTokenID: selectedPrivacySelector.getPrivacyDataByTokenID(state),
  accounts: listAllMasterKeyAccounts(state),
});

const mapDispatch = {
  setListToken,
  getBalance,
  getPTokenList,
  getInternalTokenList,
  setSelectedPrivacy,
  setDefaultAccount,
  getHistories,
  addHistory,
  updateHistory,
  getHistoryStatus,
  updatePairs,
  reloadAccountList,
};

DexContainer.propTypes = {
  account: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  histories: PropTypes.array.isRequired,
  getHistories: PropTypes.func.isRequired,
  addHistory: PropTypes.func.isRequired,
  updateHistory: PropTypes.func.isRequired,
  getHistoryStatus: PropTypes.func.isRequired,
  selectPrivacyByTokenID: PropTypes.func.isRequired,
  updatePairs: PropTypes.func.isRequired,
  accounts: PropTypes.array.isRequired,
  reloadAccountList: PropTypes.func.isRequired,
};

export default connect(
  mapState,
  mapDispatch
)(DexContainer);
