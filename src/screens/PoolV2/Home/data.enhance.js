import React, { useCallback, useState } from 'react';
import _ from 'lodash';
import { ExHandler } from '@services/exception';
import { MESSAGES } from '@src/constants';
import { getPoolConfig, getUserPoolData } from '@services/api/pool';
import COINS from '@src/constants/coin';
import formatUtils from '@utils/format';
import { useFocusEffect } from 'react-navigation-hooks';
import convert from '@src/utils/convert';
import { useSelector } from 'react-redux';
import { PRV_ID } from '@src/screens/DexV2/constants';
import { selectedPrivacySelector } from '@src/redux/selectors';

const withPoolData = (WrappedComp) => (props) => {
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState(null);
  const [userData, setUserData] = useState([]);
  const [totalRewards, setTotalRewards] = useState(0);
  const [withdrawable, setWithdrawable] = useState(false);
  const [displayFullTotalRewards, setDisplayFullTotalRewards] = useState('');
  const [displayClipTotalRewards, setDisplayClipTotalRewards] = useState('');

  const nativeToken = useSelector(
    selectedPrivacySelector.getPrivacyDataByTokenID,
  )(PRV_ID);
  const { account } = props;

  const getConfig = async () => {
    const config = await getPoolConfig();
    setConfig(config);

    return config;
  };

  const getUserData = async (account, coins) => {
    let userData = await getUserPoolData(account.PaymentAddress, coins);
    if (userData && userData.length > 0) {
      userData = userData.map(item => ({
        ...item,
        decimalBalance: convert.toNumber(item.displayBalance, true),
      }));
      userData = _.orderBy(userData, ['decimalBalance'], ['desc', 'asc']);
    }
    setUserData(userData);

    if (
      userData &&
      userData.some(
        (coin) =>
          coin.balance ||
          coin.rewardBalance ||
          coin.pendingBalance ||
          coin.unstakePendingBalance ||
          coin.WithdrawPendingBalance,
      )
    ) {
      setWithdrawable(true);
    } else {
      setWithdrawable(false);
    }

    const totalReducer = (accumulator, item) =>
      accumulator + item.rewardBalance;
    const totalRewards = userData.reduce(totalReducer, 0);

    const displayClipTotalRewards = formatUtils.amountFull(
      totalRewards,
      COINS.PRV.pDecimals,
      true,
    );
    const displayFullTotalRewards = formatUtils.amountFull(
      totalRewards,
      COINS.PRV.pDecimals,
      false,
    );

    setTotalRewards(totalRewards);
    setDisplayClipTotalRewards(displayClipTotalRewards.toString());
    setDisplayFullTotalRewards(displayFullTotalRewards.toString());
  };

  const loadData = async (account) => {
    if (loading || !account) {
      return;
    }

    try {
      setLoading(true);
      const config = await getConfig(account);
      await getUserData(account, config.coins);
    } catch (error) {
      new ExHandler(error, MESSAGES.CAN_NOT_GET_POOL_DATA).showErrorToast();
    } finally {
      setLoading(false);
    }
  };

  const loadDataDebounce = useCallback(_.debounce(loadData, 200), []);

  useFocusEffect(
    useCallback(() => {
      setUserData(null);
      setConfig(null);
      loadDataDebounce.cancel();
      loadDataDebounce(account);
    }, [account.PaymentAddress]),
  );

  return (
    <WrappedComp
      {...{
        ...props,
        loading,
        config,
        userData,
        withdrawable,
        totalRewards,
        displayFullTotalRewards,
        displayClipTotalRewards,
        onLoad: loadData,
        nativeToken,
      }}
    />
  );
};

export default withPoolData;
