import { StyleSheet } from 'react-native';
import { COLORS, FONT } from '@src/styles';

const style = StyleSheet.create({
  dialog_content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    backgroundColor: COLORS.white,
    borderRadius: 13,
  },
  title: {
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: FONT.SIZE.superMedium + 5,
    color: COLORS.black,
    textAlign: 'center',
    marginTop: 30,
  },
  text: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 7,
    color: COLORS.colorGreyBold,
    marginTop: 25,
    textAlign: 'center',
  },
  btnSubmit: {
    marginTop: 30,
  },
});

export default style;
