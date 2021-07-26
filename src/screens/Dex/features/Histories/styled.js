import { StyleSheet } from 'react-native';
import { COLORS, FONT } from '@src/styles';

export const styled = StyleSheet.create({
  wrapper: {
    paddingBottom: 25
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title: {
    ...FONT.STYLE.medium,
    fontSize: FONT.SIZE.superMedium,
    color: COLORS.black
  },
  status: {
    ...FONT.STYLE.medium,
    fontSize: FONT.SIZE.medium,
    color: COLORS.newGrey
  },
  desc: {
    ...FONT.STYLE.medium,
    fontSize: FONT.SIZE.regular,
    color: COLORS.newGrey
  }
});
