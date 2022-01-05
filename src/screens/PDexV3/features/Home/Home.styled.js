import { StyleSheet } from 'react-native';
import {FontStyle} from '@src/styles/TextStyle';
import {COLORS} from '@src/styles';
import globalStyled from '@src/theme/theme.styled';

export const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    paddingTop: 32,
    flex: 1,
  },
  groupBtns: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tradeBtn: {
    width: 115,
    maxWidth: '48%',
  },
  createNewPoolBtn: {
    width: '100%',
  },
  headerRow: {
    marginTop: 32
  },
  tab: {
    marginTop: 24,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: COLORS.colorGrey2,
    borderBottomWidth: 1,
  },
  styledTabList: {
    borderBottomWidth: 0,
  },
  title: {
    ...FontStyle.medium,
    color: COLORS.white
  },
  disabledText: {
    ...FontStyle.medium,
    color: COLORS.lightGrey31
  },
  tabEnable: {
    backgroundColor: COLORS.colorBlue
  },
  btnSearchPool: {
    ...globalStyled.defaultPaddingHorizontal,
    position: 'absolute',
    bottom: 24,
    width: '100%'
  }
});
