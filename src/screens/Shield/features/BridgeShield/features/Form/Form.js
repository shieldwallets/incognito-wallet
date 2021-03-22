import React, { memo } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import withForm from '@src/screens/Shield/features/BridgeShield/features/Form/Form.enhance';
import { KeyboardAwareScrollView } from '@components/core';
import { createForm, InputMaxValueField, InputField } from '@components/core/reduxForm';
import { formName, initialFormValues, fieldName } from '@screens/Shield/features/BridgeShield/features/Form';
import { generateTestId } from '@utils/misc';
import { SEND } from '@src/constants/elements';
import { Field } from 'redux-form';
import { RightLabel } from '@screens/Send/features/Form/Form';
import { ButtonBasic } from '@components/Button';
import BridgeStep from '@screens/Shield/features/BridgeShield/components/BridgeStep';
import { styledForm as styled } from './Form.styled';

const Form = createForm(formName, {
  initialValues: initialFormValues,
  destroyOnUnmount: true,
  enableReinitialize: true,
});

const BridgeShieldForm = memo((props) => {
  const { onChangeField } = props;
  return (
    <View style={styled.container}>
      <KeyboardAwareScrollView>
        <Form>
          {({ handleSubmit }) => (
            <>
              <Field
                onChange={(value) => onChangeField(value, fieldName.amount)}
                component={InputMaxValueField}
                name={fieldName.amount}
                placeholder="0"
                label="Shield"
                rightLabel={<RightLabel />}
                componentProps={{
                  keyboardType: 'decimal-pad',
                  style: { marginTop: 22 },
                  editable: true,
                }}
                {...generateTestId(SEND.AMOUNT_INPUT)}
              />
              <Field
                onChange={(value) => onChangeField(value, fieldName.incContractAddress)}
                component={InputField}
                name={fieldName.incContractAddress}
                label="Reception Address"
                componentProps={{
                  style: { marginTop: 22 },
                  editable: false,
                  numberOfLines: 0,
                }}
                {...generateTestId(SEND.AMOUNT_INPUT)}
              />
              <Field
                onChange={(value) => onChangeField(value, fieldName.incContractAddress)}
                component={InputField}
                name={fieldName.incAddress}
                label="Destination Address"
                componentProps={{
                  style: { marginTop: 22 },
                  canEditable: false,
                  numberOfLines: 0,
                }}
                {...generateTestId(SEND.AMOUNT_INPUT)}
              />
              <ButtonBasic title="Send" btnStyle={{ marginVertical: 50 }} />
              <BridgeStep />
            </>
          )}
        </Form>
      </KeyboardAwareScrollView>
    </View>
  );
});

BridgeShieldForm.defaultProps = {
};

BridgeShieldForm.propTypes = {
  onChangeField: PropTypes.func.isRequired,
  onPressMax: PropTypes.func.isRequired,
};

export default withForm(BridgeShieldForm);