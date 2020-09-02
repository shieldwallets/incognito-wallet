import { createSelector } from 'reselect';

import SelectedPrivacy from '@src/models/selectedPrivacy';
import memoize from 'memoize-one';
import { CONSTANT_COMMONS } from '@src/constants';
import { ExHandler } from '@src/services/exception';
import { defaultAccount } from './account';
// eslint-disable-next-line import/no-cycle
import { pTokens, tokensFollowedSelector, } from './token';

export const selectedPrivacyTokenID = createSelector(
  state => state?.selectedPrivacy?.tokenID,
  tokenId => tokenId,
);

export const getPrivacyDataByTokenID = createSelector(
  defaultAccount,
  pTokens,
  tokensFollowedSelector,
  (account, _pTokens, _followed) =>
    memoize(tokenID => {
      try {
        const pTokenData = _pTokens?.find(t => t?.tokenId === tokenID);
        const followedTokenData = _followed.find(t => t?.id === tokenID) || {};
        if (
          !pTokenData &&
          tokenID !== CONSTANT_COMMONS.PRV_TOKEN_ID
        ) {
          throw new Error(`Can not find coin with id ${tokenID}`);
        }

        const token = new SelectedPrivacy(
          account,
          { ...followedTokenData },
          pTokenData,
        );
        return {
          ...token,
          isFollowed: followedTokenData?.id === tokenID,
        };
      } catch (e) {
        new ExHandler(e);
      }
    }),
);

export const getPrivacyDataBaseOnAccount = createSelector(
  // defaultAccount,
  pTokens,
  tokensFollowedSelector,
  selectedPrivacyTokenID,
  (_internalTokens, _pTokens, _followed, tokenID) => account => {
    try {
      const pTokenData = _pTokens?.find(t => t?.tokenId === tokenID);
      const followedTokenData = _followed.find(t => t?.id === tokenID) || {};

      if (
        !pTokenData &&
        tokenID !== CONSTANT_COMMONS.PRV_TOKEN_ID
      ) {
        throw new Error(`Can not find coin with id ${tokenID}`);
      }

      return new SelectedPrivacy(
        account,
        { ...followedTokenData },
        pTokenData,
      );
    } catch (e) {
      new ExHandler(e);
    }
  },
);

export const selectedPrivacy = createSelector(
  selectedPrivacyTokenID,
  getPrivacyDataByTokenID,
  (selectedSymbol, getFn) => {
    return getFn(selectedSymbol);
  },
);

export const selectedPrivacyByFollowedSelector = createSelector(
  selectedPrivacy,
  tokensFollowedSelector,
  (selected, followed) =>
    followed.find(token => token?.id === selected?.tokenId),
);

export default {
  getPrivacyDataByTokenID,
  selectedPrivacyTokenID,
  selectedPrivacy,
  getPrivacyDataBaseOnAccount,
  selectedPrivacyByFollowedSelector,
};
