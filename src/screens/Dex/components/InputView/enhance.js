import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useDispatch, useSelector } from 'react-redux';
import { liquiditySelector, mergeInputSelector } from '@screens/Dex/Liquidity.selector';
import { isEmpty, debounce } from 'lodash';
import {
  actionChangeInputText,
  actionChangeOutputText,
  actionChangeOutputToken, actionChangeWithdrawFeeValue,
  actionFilterOutput
} from '@screens/Dex/Liquidity.actions';
import { accountSelector } from '@src/redux/selectors';

const enhance = WrappedComp => props => {
  const dispatch = useDispatch();
  const { pdeState, isFiltering, isLoading, tabName } = useSelector(liquiditySelector);
  const tokenValue = useSelector(mergeInputSelector);
  const account = useSelector(accountSelector.defaultAccount);

  const filterOutput = React.useCallback(debounce(() => dispatch(actionFilterOutput()), 300), [dispatch]);

  const onChangeInputText = (newInputText) => dispatch(actionChangeInputText({ newInputText }));

  const onChangeOutputText = (newOutputText) => dispatch(actionChangeOutputText({ newOutputText }));

  const onSelectOutputToken = (newOutputToken, newInputToken) => {
    dispatch(actionChangeOutputToken({ newInputToken, newOutputToken }));
  };

  const onChangeWithdrawFeeValue = (newWithdrawFeeText) => {
    dispatch(actionChangeWithdrawFeeValue({
      newWithdrawFeeText
    }));
  };
  React.useEffect(() => {
    const { tokens } = pdeState;
    if (isEmpty(tokens) && account) return;
    filterOutput();
  }, [pdeState, dispatch]);

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          value: tokenValue,
          isLoading: isFiltering || isLoading,
          tabName,

          onChangeInputText,
          onChangeOutputText,
          onSelectOutputToken,
          onChangeWithdrawFeeValue,
        }}
      />
    </ErrorBoundary>
  );
};

export default enhance;
