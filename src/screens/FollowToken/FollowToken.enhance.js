import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useDispatch } from 'react-redux';
import { withLayout_2 } from '@src/components/Layout';
import { compose } from 'recompose';
import {
  actionAddFollowToken,
  actionRemoveFollowToken,
} from '@src/redux/actions/token';
import { withTokenVerified } from '@src/components/Token';
import { logEvent, Events } from '@services/firebase';

const enhance = (WrappedComp) => (props) => {
  const dispatch = useDispatch();
  const handleToggleFollowToken = async (token) => {
    try {
      if (!token?.isFollowed) {
        logEvent(Events.add_coin_list, {
          name: token?.name || '',
          ticker: token?.symbol || '',
          status: token?.isVerified ? 'verified' : 'unverified',
        });
        await dispatch(actionAddFollowToken(token?.tokenId));
      } else {
        await dispatch(actionRemoveFollowToken(token?.tokenId));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          handleToggleFollowToken,
        }}
      />
    </ErrorBoundary>
  );
};

export default compose(
  withLayout_2,
  withTokenVerified,
  enhance,
);
