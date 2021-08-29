import {StyleSheet} from 'react-native';
import {UTILS} from '@src/styles';

export const styled = StyleSheet.create({
  container: {
    marginHorizontal: 25,
    flex: 1,
    marginTop: 10,
  },
  button: {
    marginVertical: 50,
    height: 50,
  },
  scrollView: {
    marginBottom: UTILS.heightScale(70),
  },
});
