import React from 'react';
import { defaultAccountSelector } from '@src/redux/selectors/account';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useNavigation } from 'react-navigation-hooks';
import { CONSTANT_COMMONS, CONSTANT_KEYS } from '@src/constants';
import routeNames from '@src/router/routeNames';
import { accountSelector, selectedPrivacySelector } from '@src/redux/selectors';
import format from '@src/utils/format';
import memmoize from 'memoize-one';
import {PRV_ID} from '@screens/Dex/constants';
import { actionFetch, actionConditionConsolidate } from './Streamline.actions';
import {
  streamlineStorageSelector,
  streamlineDataSelector,
  streamlineSelector,
  streamlineConsolidateSelector,
} from './Streamline.selector';

export const useStreamLine = ({ fetchUTXO = false } = {}) => {
  const keySave = CONSTANT_KEYS.UTXOS_DATA;
  const navigation = useNavigation();
  const selectedPrivacy = useSelector(selectedPrivacySelector.selectedPrivacy);
  const dispatch = useDispatch();
  const accountBalance = useSelector(
    accountSelector.defaultAccountBalanceSelector,
  );
  const streamline = useSelector(streamlineSelector);
  const { isFetching, isFetched, isPending, isFetchingUTXOS } = streamline;
  const streamlineStorage = useSelector(streamlineStorageSelector);
  const { data } = streamlineStorage[keySave];
  const { totalFee, times, consolidated, noUTXOS, balance } = useSelector(
    streamlineDataSelector,
  );
  const account = useSelector(defaultAccountSelector);

  const { hasExceededMaxInputPRV } = useSelector(streamlineConsolidateSelector);
  const onNavigateStreamLine = () => {
    navigation.navigate(routeNames.SelectTokenStreamline);
  };
  const handleNavigateWhyStreamline = () =>
    navigation.navigate(routeNames.WhyStreamline);

  const hookFactories = React.useMemo(() => {
    let array = [
      {
        title: 'Balance',
        desc: `${format.amount(
          accountBalance,
          CONSTANT_COMMONS.PRV.pDecimals,
          true,
        )} ${CONSTANT_COMMONS.PRV.symbol}`,
      }
    ];
    if (selectedPrivacy?.tokenId !== PRV_ID) {
      array.push({
        title: 'Balance',
        desc: `${format.amount(
          balance,
          selectedPrivacy.pDecimals,
          true,
        )} ${selectedPrivacy.symbol}`,
      });
    }
    array = array.concat([
      {
        title: 'Network fee',
        desc: `${format.amount(totalFee, CONSTANT_COMMONS.PRV.pDecimals, true)} ${
          CONSTANT_COMMONS.PRV.symbol
        }`,
      },
      {
        title: 'UTXO count',
        desc: noUTXOS,
      },
    ]);
    return array;
  }, [accountBalance, totalFee, noUTXOS, selectedPrivacy]);

  const handleDefragmentNativeCoin = async () => {
    if (shouldDisabledForm || !hasExceededMaxInputPRV) {
      return;
    }
    await dispatch(actionFetch());
  };

  const checkConditionConsolidate = () => dispatch(actionConditionConsolidate());

  const shouldDisabledForm = React.useMemo(memmoize(() => {
    return accountBalance && accountBalance < totalFee;
  }), [accountBalance, totalFee]);

  useFocusEffect(React.useCallback(() => {
    if (!fetchUTXO) return;
    checkConditionConsolidate();
  }, [account, dispatch]));

  return {
    hasExceededMaxInputPRV,
    onNavigateStreamLine,
    handleNavigateWhyStreamline,
    handleDefragmentNativeCoin,
    accountBalance,
    hookFactories,
    shouldDisabledForm,
    isFetched,
    isFetching,
    data,
    times,
    isPending,
    totalTimes: times,
    currentTime: consolidated,
    noUTXOS,
    isFetchingUTXOS,
  };
};
