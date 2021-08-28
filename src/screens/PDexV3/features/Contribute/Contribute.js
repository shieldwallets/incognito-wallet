import React from 'react';
import {RefreshControl, ScrollView, View} from 'react-native';
import { Header, RowSpaceText } from '@src/components';
import {compose} from 'recompose';
import { styled as mainStyle } from '@screens/PDexV3/PDexV3.styled';
import enhance from '@screens/PDexV3/features/Contribute/Contribute.enhance';
import { useSelector } from 'react-redux';
import {
  contributeDataSelector,
  statusContributeSelector
} from '@screens/PDexV3/features/Contribute/Contribute.selector';
import InputsGroup from '@screens/PDexV3/features/Contribute/Contribute.inputsGroup';
import PropTypes from 'prop-types';
import {createForm} from '@components/core/reduxForm';
import {formConfigs} from '@screens/PDexV3/features/Contribute/Contribute.constant';
import {ButtonTrade} from '@components/Button';

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
  const data = useSelector(contributeDataSelector);
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

const Contribute = React.memo(({ onRefresh }) => {
  const { isLoading } = useSelector(statusContributeSelector);
  return (
    <View style={mainStyle.container}>
      <Header title="Add Liquidity" />
      <ScrollView refreshControl={(<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />)}>
        <Form>
          {({ handleSubmit }) => (
            <>
              <InputsGroup />
              <ButtonTrade
                btnStyle={mainStyle.button}
                title="Add liquidity"
                disabled={isLoading}
              />
              <Extra />
            </>
          )}
        </Form>
      </ScrollView>
    </View>
  );
});

Contribute.propTypes = {
  onRefresh: PropTypes.func.isRequired
};

export default compose(
  enhance
)(Contribute);

