import { StyleSheet } from 'react-native';
import { COLORS, FONT } from '@src/styles';

export const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  rowText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    position: 'relative',
  },
  icon: {
    fontSize: 100,
    color: COLORS.primary,
    marginVertical: 40,
  },
  labelText: {
    flex: 1,
    fontFamily: FONT.NAME.medium,
    color: COLORS.colorGreyBold,
    fontSize: 15,
    lineHeight: 18,
    minWidth: 70,
  },
  extra: {
    flex: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    fontFamily: FONT.NAME.bold,
    color: COLORS.black,
    fontSize: 15,
    lineHeight: 18,
    textAlign: 'left',
    flex: 1,
  },
  copyIcon: {
    marginLeft: 5,
  },
  linkingIcon: {
    marginLeft: 5,
  },
  rowFullText: {
    height: 30,
  },
  a: {
    color: COLORS.black,
    textDecorationLine: 'underline',
  },
  p: {
    fontFamily: FONT.NAME.medium,
    color: COLORS.colorGreyBold,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 20,
  },
  btnResume: {
    height: 30,
    width: 80,
    borderRadius: 15,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.colorGrey,
    marginRight: 30,
  },
  btnChevron: {
    height: '100%',
    position: 'absolute',
    right: 0,
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: 30,
  },
});
