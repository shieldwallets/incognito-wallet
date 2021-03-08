import { Text, View } from '@components/core';
import React from 'react';
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import PropTypes from 'prop-types';
import { ButtonBasic } from '@src/components/Button';
import styled from './styles';

const DialogUpdateApp = React.memo((props) => {
  const { textTitle, textContent, visible, onPress } = props;
  const title = textTitle ? textTitle : 'Update available';
  const content = textContent
    ? textContent
    : 'We just released new version of the app!\nTo continue to use the app, simply update\nto new version on the store.';
  return (
    <Dialog width={0.84} dialogStyle={{ height: 280 }} visible={visible}>
      <DialogContent style={styled.dialog_content}>
        <View style={styled.wrapper}>
          <Text style={styled.title}>{title}</Text>
          <Text style={styled.text}>{content}</Text>
          <ButtonBasic
            title="OK"
            btnStyle={styled.btnSubmit}
            onPress={onPress}
          />
        </View>
      </DialogContent>
    </Dialog>
  );
});

DialogUpdateApp.propTypes = {
  visible: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
  textContent: PropTypes.string,
  textTitle: PropTypes.string,
};

export default DialogUpdateApp;
