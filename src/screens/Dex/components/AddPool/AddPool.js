import React from 'react';
import { View } from 'react-native';
import { compose } from 'recompose';
import ExchangeRate from '@screens/Dex/components/ExchangeRate';
import PoolSize from '@screens/Dex/components/PoolSize';
import Balance from '@screens/DexV2/components/Balance';
import NetworkFee from '@screens/Dex/components/NetworkFee';
import PropTypes from 'prop-types';
import addPoolEnhance from '@screens/Dex/components/AddPool/AddPool.enhance';
import Shares from '@screens/Dex/components/Shares';
import { useSelector } from 'react-redux';
import { shareSelectorWithToken } from '@screens/Dex/Liquidity.selector';

const AddPool = React.memo((props) => {
  const {
    inputToken,
    inputValue,
    outputToken,
    outputValue,
    pair,
    inputBalance,
    outputBalance,
    fee
  } = props;

  const { share, totalShare } = useSelector(shareSelectorWithToken)(inputToken, outputToken);

  return (
    <View>
      <View>
        <Shares totalShare={totalShare} share={share} />
        <Balance
          title={`${inputToken.symbol} Balance`}
          token={inputToken}
          balance={inputBalance}
          hideRightSymbol
        />
        {!!outputToken &&(
          <Balance
            title={`${outputToken ? outputToken.symbol : ''} Balance`}
            token={outputToken}
            balance={outputBalance}
            hideRightSymbol
          />
        )}
        <ExchangeRate
          inputToken={inputToken}
          inputValue={inputValue}
          outputToken={outputToken}
          outputValue={outputValue}
        />
        <PoolSize
          inputToken={inputToken}
          pair={pair}
          outputToken={outputToken}
        />
        <NetworkFee fee={fee} />
      </View>
    </View>
  );
});

AddPool.propTypes = {
  inputToken: PropTypes.object.isRequired,
  inputValue: PropTypes.number.isRequired,
  outputToken: PropTypes.object.isRequired,
  outputValue: PropTypes.number.isRequired,
  pair: PropTypes.object.isRequired,
  inputBalance: PropTypes.number.isRequired,
  outputBalance: PropTypes.number.isRequired,
  fee: PropTypes.number.isRequired
};

export default compose(
  addPoolEnhance
)(AddPool);
