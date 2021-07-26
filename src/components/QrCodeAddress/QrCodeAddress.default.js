import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import LoadingContainer from '@src/components/LoadingContainer';
import QrCodeGenerate from '@src/components/QrCodeGenerate';
import { CopiableTextDefault as CopiableText } from '@src/components/CopiableText';
import PropTypes from 'prop-types';
import { FONT, COLORS } from '@src/styles';

const styled = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 50,
  },
  label: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: FONT.SIZE.superMedium + 4,
    color: COLORS.black,
  },
  qrCode: {
    marginVertical: 30,
  },
  boldText: {
    fontFamily: FONT.NAME.bold,
    color: COLORS.black,
  },
  smallText: {
    fontSize: 13,
    lineHeight: 15,
    marginTop: 5,
    color: COLORS.orange,
    fontFamily: FONT.NAME.NormalText,
    marginBottom: 20,
  },
  text: {
    fontFamily: FONT.NAME.regular,
    lineHeight: FONT.SIZE.regular + 9,
    fontSize: FONT.SIZE.regular,
    color: COLORS.colorGreyBold,
    textAlign: 'center',
  },
});

const NormalText = React.memo((props) => {
  const { text, style = null, children = null } = props;
  return (
    <Text style={[styled.text, style]}>
      {text}
      {children}
    </Text>
  );
});

const QrCodeAddress = (props) => {
  const { address, label, isPending, min, symbol } = props;
  if (!address) {
    return <LoadingContainer />;
  }
  return (
    <View style={styled.container}>
      <Text style={styled.label}>{label}</Text>
      <View style={styled.qrCode}>
        <QrCodeGenerate value={address} size={150} />
      </View>
      {isPending && !!min && (
        <>
          <NormalText text="Minimum amount: ">
            <Text style={[styled.boldText]}>{`${min} ${symbol}`}</Text>
          </NormalText>
          <NormalText
            text="Smaller amounts will not be processed."
            style={styled.smallText}
          />
        </>
      )}
      <CopiableText data={address} />
    </View>
  );
};

QrCodeAddress.propTypes = {
  address: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  isPending: PropTypes.bool.isRequired,
  min: PropTypes.number,
  symbol: PropTypes.string,
};

export default QrCodeAddress;
