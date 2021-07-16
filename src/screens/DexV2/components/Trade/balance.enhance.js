import React from 'react';
import accountService from '@services/wallet/accountService';
import { PRV } from '@services/wallet/tokenService';
import convert from '@utils/convert';
import formatUtil from '@utils/format';
import { PrivacyVersion } from 'incognito-chain-web-js/build/wallet';
import {PRV_ID} from '@screens/Dex/constants';

const withBalanceLoader = WrappedComp => (props) => {
  const [inputBalance, setInputBalance] = React.useState(null);
  const [inputBalanceText, setInputBalanceText] = React.useState('');
  const [prvBalance, setPRVBalance] = React.useState(null);
  const [lastInputToken, setLastInputToken] = React.useState(null);
  const [lastAccount, setLastAccount] = React.useState(null);

  const {
    inputToken,
    onChangeInputText,
    feeToken,
    pairTokens,
    inputFee,
    account,
    wallet,
  } = props;

  const loadBalance = async (tokenChange = false) => {
    try {
      const token = inputToken;
      const balance = await accountService.getBalance({
        account,
        wallet,
        tokenID: token.id || token.tokenId,
      });

      if (inputToken.id !== token.id) {
        return;
      }

      if (token !== PRV) {
        const prvBalance = await accountService.getBalance({
          account,
          wallet,
          tokenID: PRV_ID,
        });
        setPRVBalance(prvBalance);
      } else {
        setPRVBalance(balance);
      }

      if (tokenChange) {
        if (!balance && balance <= inputFee) {
          onChangeInputText('');
        } else {
          let humanAmount = convert.toHumanAmount(balance, inputToken.pDecimals);
          if (humanAmount < 1) {
            humanAmount = formatUtil.toFixed(humanAmount, inputToken.pDecimals);
            onChangeInputText(humanAmount.toString());
          } else {
            onChangeInputText('1');
          }
        }
      }

      setInputBalance(balance);
      setInputBalanceText(formatUtil.amountFull(balance, token?.pDecimals));
    } catch (error) {
      console.debug('GET INPUT BALANCE ERROR', error);
    }
  };

  React.useEffect(() => {
    setInputBalance(null);
    if (feeToken) {
      loadBalance(lastInputToken !== inputToken || lastAccount !== account);
      setLastInputToken(inputToken);
      setLastAccount(account);
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
