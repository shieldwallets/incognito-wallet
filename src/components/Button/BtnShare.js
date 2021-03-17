import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import Share from 'react-native-share';
import PropTypes from 'prop-types';
import { Toast } from '@src/components/core';
import srcShareButton from '@src/assets/images/icons/share_btn.png';

const styled = StyleSheet.create({
  icon: {
    width: 22,
    height: 18,
  },
});

const onClickShare = (value) => {
  const options = {
    message: value,
    title: 'Share your address'
  };
  try {
    Share.open(options)
      .then((res) => {
        console.log(`share success ${res}`);
      });
  } catch (error) {
    Toast.showError(
      'Share address error!',
    );
  }
};

const BtnShare = props => {
  const {value} = props;
  return (
    <TouchableOpacity value={value} onPress={() => onClickShare(value)} {...props}>
      <Image style={styled.icon} source={srcShareButton} />
    </TouchableOpacity>
  );
};
BtnShare.defaultProps = {
  value: ''
};

BtnShare.propTypes = {
  value: PropTypes.string
};

export default BtnShare;
