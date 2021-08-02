import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { SuccessModal } from '@src/components';
import mainStyles from '@screens/DexV2/style';
import { useNavigation } from 'react-navigation-hooks';

const withSuccess = WrappedComp => props => {
  const navigation = useNavigation();
  const {
    successTitle,
    successDesc,
    account,
    onNavSuccess
  } = props;

  const [visible, setVisible] = React.useState(false);

  const onCloseModal = () => {
    setVisible(false);
    if (typeof onNavSuccess === 'function') {
      onNavSuccess();
    }
    navigation.goBack();
  };

  const description = typeof successDesc === 'function' ? successDesc(account.name) : successDesc;

  const onSuccess = () => setVisible(true);

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          onSuccess,
          showSuccess: visible
        }}
      />
      <SuccessModal
        closeSuccessDialog={onCloseModal}
        title={successTitle}
        buttonTitle="OK"
        buttonStyle={mainStyles.button}
        extraInfo={description}
        visible={visible}
      />
    </ErrorBoundary>
  );
};

export default withSuccess;
