import React, { useState } from 'react';
import { ExHandler } from '@services/exception';
import { MESSAGES } from '@src/constants';
import { getPoolConfig, getUserPoolData } from '@services/api/pool';

const withPoolData = WrappedComp => (props) => {
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState(null);
  const [userData, setUserData] = useState([]);

  const { account } = props;

  const getConfig = async () => {
    const config = await getPoolConfig();
    setConfig(config);
  };

  const getUserData = async () => {
    const userData = await getUserPoolData(account.PaymentAddress);
    setUserData(userData);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        getConfig(),
        getUserData(),
      ]);
    } catch (error) {
      new ExHandler(error, MESSAGES.CAN_NOT_GET_PDEX_DATA).showErrorToast();
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  return (
    <WrappedComp
      {...{
        ...props,
        loading,
        config,
        userData,
        onLoadStakeData: loadData,
      }}
    />
  );
};

export default withPoolData;
