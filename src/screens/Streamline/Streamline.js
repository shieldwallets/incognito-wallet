import React from 'react';
import { View, Text, RefreshControl } from 'react-native';
import Header from '@src/components/Header';
import { BtnQuestionDefault, ButtonBasic } from '@src/components/Button';
import srcQuestion from '@src/assets/images/icons/question_gray.png';
import { LoadingContainer, ScrollView } from '@src/components/core';
import LoadingTx from '@src/components/LoadingTx';
import PropTypes from 'prop-types';
import { MAX_NO_INPUT_DEFRAGMENT } from '@screens/Streamline/Streamline.constant';
import {useNavigation} from 'react-navigation-hooks';
import {useSelector} from 'react-redux';
import {selectedPrivacySelector} from '@src/redux/selectors';
import withStreamline from './Streamline.enhance';
import { useStreamLine } from './Streamline.useStreamline';
import { styled } from './Streamline.styled';

const Hook = React.memo((props) => {
  const { title, desc, disabled = false } = props?.data;
  if (disabled) {
    return null;
  }
  return (
    <View style={styled.hook}>
      <Text style={styled.hookTitle}>{title}</Text>
      <Text style={styled.hookDesc}>{desc}</Text>
    </View>
  );
});

const Extra = () => {
  const {
    handleDefragmentNativeCoin,
    hookFactories,
    shouldDisabledForm,
    noUTXOS,
  } = useStreamLine();
  const selectPrivacy = useSelector(selectedPrivacySelector.selectedPrivacy);
  return (
    <>
      <Text style={[styled.tooltip, { marginBottom: 30 }]}>
        Consolidate your UTXOs to ensure successful transactions of any amount.
      </Text>
      <Text style={styled.tooltip}>
        There are {noUTXOS} UTXOs {selectPrivacy?.symbol} in this keychain. You can consolidate{' '}
        {noUTXOS} UTXOs {selectPrivacy?.symbol} at a time.
      </Text>
      <ButtonBasic
        btnStyle={styled.btnStyle}
        title="Consolidate"
        onPress={handleDefragmentNativeCoin}
        disabled={shouldDisabledForm}
      />
      {hookFactories.map((item, id) => (
        <Hook data={item} key={id} />
      ))}
    </>
  );
};

const Empty = React.memo(() => {
  return (
    <View style={styled.emptyContainer}>
      <Text style={styled.emptyTitle}>Consolidation complete.</Text>
      <Text style={styled.emptyText}>
        You’re now running at peak efficiency.
      </Text>
    </View>
  );
});

const Pending = React.memo(() => {
  const { noUTXOS } = useStreamLine();

  if (noUTXOS > MAX_NO_INPUT_DEFRAGMENT) {
    return (
      <View style={styled.pendingContainer}>
        <Text style={styled.emptyTitle}>Consolidation in process.</Text>
        <Text style={styled.emptyText}>
          Your remaining UTXOS {noUTXOS}. Please make another
          consolidation after this one is complete.
        </Text>
      </View>
    );
  }

  return <Empty />;
});

const Streamline = (props) => {
  const { onClearData, handleFetchData } = props;
  const navigation = useNavigation();
  const selectPrivacy = useSelector(selectedPrivacySelector.selectedPrivacy);
  const {
    hasExceededMaxInputPRV,
    handleNavigateWhyStreamline,
    isFetching,
    isFetchingUTXOS,
    isPending
  } = useStreamLine();
  const renderMain = () => {
    if (isFetchingUTXOS) {
      return <LoadingContainer />;
    }
    if (!hasExceededMaxInputPRV) {
      return <Empty />;
    }
    if (isPending) {
      return <Pending />;
    }
    return (
      <ScrollView style={styled.scrollview}>
        <Extra {...props} />
        {isFetching && <LoadingTx />}
      </ScrollView>
    );
  };
  return (
    <View style={styled.container}>
      <Header
        title={`Consolidate ${selectPrivacy?.symbol ? selectPrivacy?.symbol : ''}`}
        customHeaderTitle={(
          <BtnQuestionDefault
            style={styled.questionIcon}
            icon={srcQuestion}
            onPress={handleNavigateWhyStreamline}
          />
        )}
        onGoBack={() => {
          if (isPending) {
            onClearData();
            handleFetchData();
          }
          navigation.goBack();
        }}
      />
      {renderMain()}
    </View>
  );
};

Streamline.propTypes = {
  handleFetchData: PropTypes.func.isRequired,
  onClearData: PropTypes.func.isRequired,
};

export default withStreamline(Streamline);
