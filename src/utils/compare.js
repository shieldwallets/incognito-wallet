import toLower from 'lodash/toLower';

export const compareTextLowerCase = (text1, text2) => {
  return toLower(text1) === toLower(text2);
};
