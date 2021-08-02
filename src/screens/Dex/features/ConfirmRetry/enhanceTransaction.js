import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import accountServices from '@services/wallet/accountService';
import { TRANSACTION_FEE } from '@screens/Dex/Liquidity.constants';
import Loading from '@screens/Dex/components/Loading';
import { ExHandler } from '@services/exception';
import {useNavigation, useNavigationParam} from 'react-navigation-hooks';
import { useDispatch, useSelector } from 'react-redux';
import { accountSelector } from '@src/redux/selectors';
import { SuccessModal } from '@src/components';
import mainStyles from '@screens/DexV2/style';
import routeNames from '@routers/routeNames';
import { actionFetchHistories } from '@screens/Dex/Liquidity.actions';

const withTransaction = WrappedComp => props => {
  const params = useNavigationParam('params') || {};
  const {
    isRetry,
    retryTokenID,
    refundTokenID,
    retryAmount,
    refundAmount,
    pairId,
    retryToken,
    refundToken,
  } = params;
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const wallet = useSelector(state => state.wallet);
  const account = useSelector(accountSelector.defaultAccount);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [visible, setVisible] = React.useState(false);

  const onCreateContribute = async () => {
    const tokenId = isRetry ? retryTokenID : refundTokenID;
    await accountServices.createAndSendTxWithRetryContribution({
      account,
      wallet,
      tokenID: tokenId,
      amount: isRetry ? retryAmount : 1,
      fee: TRANSACTION_FEE,
      pairID: pairId
    });
  };

  const onConfirmPress = async () => {
    if (loading || error) return;
    try {
      setLoading(true);
      await onCreateContribute();
      setTimeout(() => {
        setVisible(true);
      }, 500);
    } catch (error) {
      setError(new ExHandler(error).getMessage(error?.message));
      new ExHandler(error).showErrorToast();
    } finally {
      setLoading(false);
    }
  };

  const onCloseModal = () => {
    setVisible(false);
    navigation.navigate(routeNames.Dex);
    dispatch(actionFetchHistories());
  };

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          error,
          loading,
          isRetry,
          account,
          retryTokenID,
          refundTokenID,
          retryAmount,
          refundAmount,
          pairId,
          retryToken,
          refundToken,
          onConfirmPress,
        }}
      />
      <Loading open={loading} />
      <SuccessModal
        closeSuccessDialog={onCloseModal}
        title="Success"
        buttonTitle="OK"
        buttonStyle={mainStyles.button}
        extraInfo={`Please wait a few minutes for your ${account?.name} to update`}
        visible={visible}
      />
    </ErrorBoundary>
  );
};

export default withTransaction;
