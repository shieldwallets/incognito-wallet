import React from 'react';
import {RefreshControl, ScrollView, View} from 'react-native';
import PropTypes from 'prop-types';
import {Header, RowSpaceText} from '@src/components';
import {RoundCornerButton} from '@components/core';
import { styled as mainStyle } from '@screens/PDexV3/PDexV3.styled';
import {createForm} from '@components/core/reduxForm';
import {formConfigs} from '@screens/PDexV3/features/RemovePool/RemovePool.constant';
import InputsGroup from '@screens/PDexV3/features/RemovePool/RemovePool.inputsGroup';
import withInput from '@screens/PDexV3/features/RemovePool/RemovePool.enhance';
import {useSelector} from 'react-redux';
import {
  maxShareAmountSelector,
  shareDataSelector,
  statusRemovePoolSelector
} from '@screens/PDexV3/features/RemovePool/RemovePool.selector';

const initialFormValues = {
  inputToken: '',
  outputToken: '',
};

const Form = createForm(formConfigs.formName, {
  initialValues: initialFormValues,
  destroyOnUnmount: true,
  enableReinitialize: true,
});

const Extra = React.memo(() => {
  const data = useSelector(shareDataSelector);
  const renderHooks = () => {
    if (!data) return;
    return (data?.hookFactories || []).map(item => <RowSpaceText {...item} key={item?.label} />);
  };
  return(
    <>
      {renderHooks()}
    </>
  );
});

const RemovePool = React.memo(({ onRefresh }) => {
  const shareData = useSelector(shareDataSelector);
  const { isLoading } = useSelector(statusRemovePoolSelector);
  const maxShare = useSelector(maxShareAmountSelector);
  return (
    <View style={mainStyle.container}>
      <Header title="Remove Liquidity" />
      <ScrollView refreshControl={(<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />)}>
        <Form>
          {({ handleSubmit }) => (
            <>
              <InputsGroup />
              <RoundCornerButton
                style={mainStyle.button}
                title="Remove Liquidity"
              />
              <Extra />
            </>
          )}
        </Form>
      </ScrollView>
    </View>
  );
});

RemovePool.propTypes = {
  onRefresh: PropTypes.func.isRequired,
};

export default withInput(RemovePool);

