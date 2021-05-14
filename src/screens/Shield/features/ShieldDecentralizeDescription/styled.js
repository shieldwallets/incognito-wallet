import { StyleSheet } from 'react-native';
import {COLORS, FONT} from '@src/styles';

export const styled = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    ...FONT.STYLE.medium,
    lineHeight: 25,
    color: COLORS.newGrey,
    fontSize: FONT.SIZE.regular
  },
  wrapper: {
    flex: 1,
    paddingTop: 43,
    marginBottom: 40
  },
});
