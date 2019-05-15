import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getBalance } from '@src/redux/actions/account';
import SendConstant from './SendConstant';

const SendConstantContainer = ({ wallet, defaultAccount, ...otherProps}) => (
  <SendConstant wallet={wallet} account={defaultAccount}  {...otherProps} />
);

const mapState = state => ({
  defaultAccount: state.account.defaultAccount,
  wallet: state.wallet,
});

const mapDispatch = { getBalance };

SendConstantContainer.propTypes = {
  defaultAccount: PropTypes.object,
  wallet: PropTypes.object,
};

export default connect(mapState, mapDispatch)(SendConstantContainer);