import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {batch, useDispatch, useSelector} from 'react-redux';
import {createPoolActions} from '@screens/PDexV3/features/CreatePool';
import {
  inputTokensListSelector,
  outputTokensListSelector
} from '@screens/PDexV3/features/CreatePool/CreatePool.selector';
import {useNavigation} from 'react-navigation-hooks/src/Hooks';
import routeNames from '@routers/routeNames';

const enhance = WrappedComp => props => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const outputList = useSelector(outputTokensListSelector);
  const inputList = useSelector(inputTokensListSelector);
  const onChange = ({ text, field }) => dispatch(createPoolActions.actionChangeInput({ text, field }));
  const onSelectInputToken = (token) => {
    batch(() => {
      navigation.navigate(routeNames.CreatePool);
      dispatch(createPoolActions.actionChangeInputTokenIDStr(token?.tokenId));
    });
  };
  const onSelectOutputToken = (token) => {
    batch(() => {
      navigation.navigate(routeNames.CreatePool);
      dispatch(createPoolActions.actionChangeOutputTokenIDStr(token.tokenId));
    });
  };
  const onPressInputSymbol = () => navigation.navigate(routeNames.SelectTokenTrade, { data: inputList, onSelectToken: onSelectInputToken });
  const onPressOutputSymbol = () => navigation.navigate(routeNames.SelectTokenTrade, { data: outputList, onSelectToken: onSelectOutputToken });
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          onChange,
          onPressInputSymbol,
          onPressOutputSymbol
        }}
      />
    </ErrorBoundary>
  );
};

export default enhance;
