import React from 'react';
import { useSelector } from 'react-redux';
import { SectionItem as Section } from '@screens/Setting/features/Section';
import ErrorBoundary from '@src/components/ErrorBoundary';
import RemoveSuccessDialog from '@src/screens/Setting/features/RemoveStorage/RemoveStorage.Dialog';
import { defaultAccountSelector } from '@src/redux/selectors/account';
import accountServices from '@src/services/wallet/accountService';
import { walletSelector } from '@src/redux/selectors/wallet';

const RemoveBalanceCached = () => {
  const [visible, setVisible] = React.useState(false);
  const defaultAccount = useSelector(defaultAccountSelector);
  const wallet = useSelector(walletSelector);
  const onRemoveItem = async () => {
    try {
      await accountServices.removeCacheBalance(defaultAccount, wallet);
    } catch (error) {
      console.debug('ERROR', error);
    }
  };
  const onPressRemove = () => setVisible(true);
  return (
    <ErrorBoundary>
      <RemoveSuccessDialog
        visible={visible}
        onPressCancel={() => setVisible(false)}
        onPressAccept={() => {
          setVisible(false);
          onRemoveItem().then();
        }}
        title="Clear balance"
        subTitle="This will delete balance cached. Are you sure you want to continue?"
      />
      <Section
        data={{
          title: 'Clear balance cached',
          desc: 'Remove locally stored balance',
          handlePress: onPressRemove,
        }}
      />
    </ErrorBoundary>
  );
};

RemoveBalanceCached.propTypes = {};

export default React.memo(RemoveBalanceCached);
