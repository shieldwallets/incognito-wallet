import React from 'react';
import accountService from '@services/wallet/accountService';
import formatUtil from '@utils/format';
import { PRV_ID } from '@screens/DexV2/constants';

const withBalanceLoader = WrappedComp => (props) => {
  const [inputBalance, setInputBalance] = React.useState(null);
  const [inputBalanceText, setInputBalanceText] = React.useState('');
  const [prvBalance, setPRVBalance] = React.useState(null);

  const {
    inputToken,
    feeToken,
    pairTokens,
    account,
    wallet,
  } = props;

  const loadBalance = async () => {
    try {
      const token = inputToken;
      const balance = await accountService.getBalance(account, wallet, token.id);
      setInputBalance(balance);
      setInputBalanceText(formatUtil.amountFull(balance, token?.pDecimals));

      if (token.id !== PRV_ID) {
        const prvBalance = await accountService.getBalance(account, wallet);
        setPRVBalance(prvBalance);
      } else {
        setPRVBalance(balance);
      }
    } catch (error) {
      console.debug('GET INPUT BALANCE ERROR', error);
    }
  };

  React.useEffect(() => {
    setInputBalance(null);
    if (feeToken) {
      loadBalance();
    }
  }, [account, feeToken, pairTokens, inputToken]);

  return (
    <WrappedComp
      {...{
        ...props,
        inputBalance,
        inputBalanceText,
        prvBalance,
        account,

        onChangeInputBalance: setInputBalance,
        onChangePRVBalance: setPRVBalance,
      }}
    />
  );
};

export default withBalanceLoader;
