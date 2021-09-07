import { StyleSheet } from 'react-native';
import { FONT, COLORS, UTILS } from '@src/styles';

const fontSize = UTILS.widthScale(34);
const lineHeight = fontSize + 4;

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    marginTop: 20,
    flex: 1,
  },
  rewards: {
    marginTop: UTILS.heightScale(23),
    marginBottom: UTILS.heightScale(7.5),
  },
  amount: {
    fontFamily: FONT.NAME.bold,
    fontSize: fontSize,
    lineHeight: lineHeight,
  },
  symbol: {
    fontSize: fontSize,
    lineHeight: lineHeight,
    color: COLORS.dark1,
  },
  symbolUSD: {
    fontSize: 18,
    fontFamily: FONT.NAME.medium,
    color: COLORS.newGrey,
  },
  center: {
    textAlign: 'center',
  },
  icon: {
    marginLeft: 5,
    alignSelf: 'flex-start',
    marginTop: UTILS.heightScale(2),
  },
  actions: {

  },
  actionButton: {
    marginTop: UTILS.heightScale(37),
    marginHorizontal: 4,
    flex: 1,
  },
  coinContainer: {
    marginTop: UTILS.heightScale(30),
    flex: 1,
  },
  coin: {
    marginBottom: UTILS.heightScale(30),
  },
  coinName: {
    fontFamily: FONT.NAME.bold,
    fontSize: 20,
  },
  coinInterest: {
    fontSize: 20,
    color: COLORS.green2,
    fontFamily: FONT.NAME.medium,
    textAlign: 'right',
    flex: 1,
  },
  rateChange: {
    position: 'absolute',
    backgroundColor: 'white',
    paddingVertical: UTILS.heightScale(15),
    bottom: 0,
    left: 0,
    right: 0,
    marginBottom: UTILS.heightScale(15),
  },
  rateStyle: {
    fontFamily: FONT.NAME.medium,
    color: COLORS.newGrey,
    fontSize: 18,
  },
  scrollView: {
    marginBottom: UTILS.heightScale(70),
  },
});
