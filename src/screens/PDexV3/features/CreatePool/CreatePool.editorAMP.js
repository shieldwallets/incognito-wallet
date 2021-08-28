import React from 'react';
import {RFTAMPEditor as AMPEditor, validator} from '@components/core/reduxForm';
import {formConfigs} from '@screens/PDexV3/features/CreatePool/CreatePool.constant';
import {Field} from 'redux-form';
import {View} from 'react-native';
import {styled} from '@screens/PDexV3/features/CreatePool/index';

const CustomAMPEditor = () => {
  return (
    <View style={styled.wrapAMP}>
      <Field
        component={AMPEditor}
        name={formConfigs.amp}
        validate={[
          ...validator.combinedAmount,
        ]}
      />
    </View>
  );
};

export default React.memo(CustomAMPEditor);
