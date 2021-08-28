import React from 'react';
import { ScrollView, View } from 'react-native';
import PropTypes from 'prop-types';
import {Header, RowSpaceText} from '@src/components';
import {RoundCornerButton} from '@components/core';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import {hookFactoriesSelector, InputsGroup} from '@screens/PDexV3/features/CreatePool';
import {createForm} from '@components/core/reduxForm';
import {formConfigs} from '@screens/PDexV3/features/CreatePool/CreatePool.constant';
import withCreatePool from '@screens/PDexV3/features/CreatePool/CreatePool.enhance';
import {useSelector} from 'react-redux';
import EditorAMP from '@screens/PDexV3/features/CreatePool/CreatePool.editorAMP';

const initialFormValues = {
  inputToken: '',
  outputToken: '',
  amp: ''
};

const Form = createForm(formConfigs.formName, {
  initialValues: initialFormValues,
  destroyOnUnmount: true,
  enableReinitialize: true,
});

const Extra = React.memo(() => {
  const hooks = useSelector(hookFactoriesSelector);
  const renderHooks = () => {
    return hooks.map(item => <RowSpaceText {...item} key={item?.label} />);
  };
  return(
    <>
      {renderHooks()}
    </>
  );
});

const CreatePool = React.memo(() => {
  return (
    <View style={mainStyle.container}>
      <Header title="Create Pool" />
      <ScrollView>
        <Form>
          {({ handleSubmit }) => (
            <>
              <InputsGroup />
              <RoundCornerButton
                style={mainStyle.button}
                title="Create Pool"
              />
              <EditorAMP />
              <Extra />
            </>
          )}
        </Form>
      </ScrollView>
    </View>
  );
});

CreatePool.propTypes = {};

export default withCreatePool(CreatePool);

