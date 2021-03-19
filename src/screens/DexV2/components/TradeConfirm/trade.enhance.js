import React from 'react';
import { MESSAGES } from '@screens/Dex/constants';
import { PRV } from '@services/wallet/tokenService';
import { COINS, CONSTANT_COMMONS } from '@src/constants';
import { ExHandler } from '@services/exception';
import accountService from '@services/wallet/accountService';
import { DEFI_TRADING_FEE, MAX_FEE_PER_TX } from '@components/EstimateFee/EstimateFee.utils';
import { TradeHistory } from '@models/dexHistory';
import { useDispatch } from 'react-redux';
import { addHistory } from '@src/redux/actions/dex';

const withTrade = WrappedComp => (props) => {
  const [error, setError] = React.useState('');
  const [trading, setTrading] = React.useState(false);
  const dispatch = useDispatch();

  const onAddHistory = (history) => {
    dispatch(addHistory(history));
  };

  const {
    inputValue,
    inputToken,
    inputBalance,
    outputToken,
    outputValue,
    minimumAmount,
    prvBalance,
    fee,
    feeToken,
    onTradeSuccess,
    wallet,
    account,
  } = props;

  const trade = async () => {
    let prvFee = 0;
    let tokenFee = 0;
    if (trading) {
      return;
    }

    setTrading(true);
    setError('');

    try {
      if (inputToken?.id === PRV.id) {
        prvFee = fee;
        tokenFee = fee;
      } else {
        prvFee = feeToken.id === COINS.PRV_ID ? fee : 0;
        tokenFee = prvFee > 0 ? 0 : fee;
      }

      if (inputBalance < inputValue + tokenFee) {
        return setError(MESSAGES.NOT_ENOUGH_BALANCE_TO_TRADE(inputToken.symbol));
      }

      console.debug('PRV BALANCE', prvBalance, prvFee);

      if (prvBalance < prvFee) {
        return setError(MESSAGES.NOT_ENOUGH_PRV_NETWORK_FEE);
      }

      if (inputToken.id === COINS.PRV_ID) {
        const result = await accountService.createAndSendNativeTokenTradeRequestTx(
          wallet,
          account,
          MAX_FEE_PER_TX,
          outputToken.id,
          inputValue,
          minimumAmount,
          0,
        );

        if (result && result.txId) {
          onTradeSuccess(true);

          onAddHistory(new TradeHistory(result, inputToken, outputToken, inputValue, outputValue, MAX_FEE_PER_TX, 'PRV', minimumAmount));
        }
      } else {
        const tokenObject = {
          Privacy: true,
          TokenID: inputToken.id,
          TokenName: 'Name',
          TokenSymbol: 'Symbol',
          TokenTxType: CONSTANT_COMMONS.TOKEN_TX_TYPE.SEND,
          TokenAmount: inputValue,
        };
        const result = await accountService.createAndSendPTokenTradeRequestTx(
          wallet,
          account,
          tokenObject,
          0,
          MAX_FEE_PER_TX,
          outputToken.id,
          inputValue,
          minimumAmount,
          0,
        );

        if (result && result.txId) {
          onTradeSuccess(true);
          const newHistory = new TradeHistory(result, inputToken, outputToken, inputValue, minimumAmount, MAX_FEE_PER_TX, outputToken.symbol, 0);
          console.debug('NEW HISTORY');
          onAddHistory(newHistory);
        }
      }
    } catch (error) {
      setError(new ExHandler(error).getMessage(MESSAGES.TRADE_ERROR));
    } finally {
      setTrading(false);
    }
  };

  return (
    <WrappedComp
      {...{
        ...props,
        trading,
        onTrade: trade,
        error,
      }}
    />
  );
};

export default withTrade;
