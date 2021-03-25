import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import { withLayout_2 } from '@src/components/Layout';
import Header from '@src/components/Header';
import { COLORS, FONT } from '@src/styles';
import PropTypes from 'prop-types';
import { RoundCornerButton } from '@components/core';
import routeNames from '@src/router/routeNames';
import { useDispatch } from 'react-redux';
import { MESSAGES } from '@src/constants';
import ic_radio from '@src/assets/images/icons/ic_radio.png';
import ic_radio_check from '@src/assets/images/icons/ic_radio_check.png';
import { actionFetch as fetchDataShield } from '../../Shield.actions';

const TermOfUseShield = (props) => {
  const { navigation } = props;
  const dispatch = useDispatch();

  const tokenId = navigation.getParam('tokenId');
  const terms = ['I will send tokens from centralized exchanges', 
    'I will send tokens from a smart contract', 'I will send tokens from my own wallet'];
  const [choose, setChoose] = React.useState(undefined);

  const handlePressNext = async () => {
    navigation.navigate(routeNames.ShieldGenQRCode);
    await dispatch(fetchDataShield({ tokenId }));
  };

  const handlePress = (index) => {
    setChoose(index);
  };

  return (
    <View style={styled.container}>
      <Header title="Term of use" />
      <ScrollView style={styled.scrollview}>
        <Text style={[styled.text, { marginBottom: 22 }]}>
          You have to deposit tokens to an address provided by Bridge. How will you complete this transaction?
        </Text>
        {terms && terms.map((item, index) => {
          return (
            <TouchableOpacity 
              style={index === choose ? styled.selectedButton : styled.unSelectedButon} 
              key={`key-${index}`}
              onPress={() => handlePress(index)}
            >
              <View style={styled.contentView}>
                <Image style={styled.icon} source={index === choose ? ic_radio_check : ic_radio} />
                <Text style={[styled.text, { marginRight: 20, color: index === choose ? COLORS.black : COLORS.colorGreyBold }]}>{item}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
        <RoundCornerButton
          style={styled.button}
          title="Next"
          disabled={(choose !== 1 && choose !== terms.length - 1)}
          onPress={handlePressNext}
        />
        {choose === 0 && <Text style={styled.errorText}>{MESSAGES.WARNING_TERMSOFUSE}</Text>}
      </ScrollView>
    </View>
  );
};

TermOfUseShield.propTypes = {
  navigation: PropTypes.any.isRequired,
};

export default withLayout_2(TermOfUseShield);

const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollview: {
    marginTop: 22,
  },
  text: {
    color: COLORS.colorGreyBold,
    fontFamily: FONT.NAME.specialMedium,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.medium + 4,
  },
  icon: {
    marginTop: 2,
    marginRight: 8,
  },
  contentView: {
    flexDirection: 'row',
  },
  selectedButton: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 0,
    marginBottom: 16,
    backgroundColor: '#EFEFEF',
  },
  unSelectedButon: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.colorGreyLight,
    marginBottom: 16
  },
  button: {
    marginTop: 30,
    backgroundColor: COLORS.black,
  },
  errorText: {
    ...FONT.STYLE.regular,
    textAlign: 'center',
    marginTop: 40,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.medium + 4,
    color: COLORS.orange,
  },
});