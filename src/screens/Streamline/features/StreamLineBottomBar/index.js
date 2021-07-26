import React from 'react';
import { useStreamLine } from '@screens/Streamline';
import { BottomBar } from '@components/core';
import { useSelector } from 'react-redux';
import { convertCoinsDataSelector } from '@screens/Home/features/Convert/Convert.selector';

const StreamLineBottomBar = React.memo(() => {
  const { hasExceededMaxInputPRV, isFetchingUTXOS, onNavigateStreamLine } = useStreamLine({ fetchUTXO: true });
  const { isConvert } = useSelector(convertCoinsDataSelector);
  if (!hasExceededMaxInputPRV || !!isFetchingUTXOS || isConvert) {
    return null;
  }
  return (
    <BottomBar
      onPress={onNavigateStreamLine}
      text="Streamline this keychain now for efficient transactions"
    />
  );
});

export default StreamLineBottomBar;
