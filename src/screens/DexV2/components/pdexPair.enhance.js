import React, { useState } from 'react';
import { getTokenList } from '@services/api/token';
import tokenService from '@services/wallet/tokenService';
import _ from 'lodash';
import { CustomError, ErrorCode, ExHandler } from '@services/exception';
import convertUtil from '@utils/convert';
import { PRIORITY_LIST } from '@screens/Dex/constants';
import { COINS, MESSAGES } from '@src/constants';
import { getPDEPairs } from '@services/wallet/RpcClientService';
import http from '@services/http';

class IncognitoCoinInfo {
  constructor(data = {}) {
    this.id = data?.TokenID;
    this.tokenID = data?.TokenID;
    this.createdAt = data?.CreatedAt;
    this.updatedAt = data?.UpdatedAt;
    this.deletedAt = data?.DeletedAt;
    this.image = data?.Image;
    this.isPrivacy = data?.IsPrivacy;
    this.name = data?.Name;
    this.symbol = data?.Symbol;
    this.userID = data?.UserID;
    this.ownerAddress = data?.OwnerAddress;
    this.description = data?.Description;
    this.showOwnerAddress = Boolean(data?.ShowOwnerAddress);
    this.isOwner = data?.IsOwner;
    this.ownerName = data?.OwnerName;
    this.ownerEmail = data?.OwnerEmail;
    this.ownerWebsite = data?.OwnerWebsite;
    this.totalSupply = data?.Amount;
    this.verified = data?.Verified || false;
    this.amount = 0;
  }
}

const getTokenInfoNoCache = () => {
  return http.get('pcustomtoken/list')
    .then(res => res.map(token => new IncognitoCoinInfo(token)));
};

const calculateOutputValue = (pair, inputId, inputValue, outputId) => {
  try {
    if (!pair) {
      return 0;
    }

    let inputPool;
    let outputPool;

    if (pair.Token1IDStr === inputId) {
      inputPool = pair.Token1PoolValue;
      outputPool = pair.Token2PoolValue;
    } else {
      inputPool = pair.Token2PoolValue;
      outputPool = pair.Token1PoolValue;
    }

    const initialPool = inputPool * outputPool;
    const newInputPool = inputPool + inputValue;
    const newOutputPoolWithFee = Math.ceil(initialPool / newInputPool);
    return outputPool - newOutputPoolWithFee;
  } catch (error) {
    console.debug('CALCULATE OUTPUT', error);
  }
};
const USDT_ID = '716fd1009e2a1669caacc36891e707bfdf02590f96ebd897548e8963c95ebac0';
const USDC_ID = '1ff2da446abfebea3ba30385e2ca99b0f0bbeda5c6371f4c23c939672b429a42';
const DAI_ID = '3f89c75324b46f13c7b036871060e641d996a24c09b3065835cb1d38b799d6c1';
const PRV_ID = '0000000000000000000000000000000000000000000000000000000000000004';

const withPairs = WrappedComp => (props) => {
  const [loading, setLoading] = useState(false);
  const [pairs, setPairs] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [pairTokens, setPairTokens] = useState([]);
  const [shares, setShares] = useState([]);
  const [extra, setExtra] = useState({});

  const loadPairs = async () => {
    try {
      setLoading(true);
      const pTokens = await getTokenList();
      const chainTokens = await getTokenInfoNoCache();
      const state = await getPDEPairs();
      const tokens = tokenService.mergeTokens(chainTokens, pTokens);
      const chainPairs = state.state;

      if (!_.has(chainPairs, 'PDEPoolPairs')) {
        return new ExHandler(new CustomError(ErrorCode.FULLNODE_DOWN), MESSAGES.CAN_NOT_GET_PDEX_DATA).showErrorToast();
      }

      const pairs = _(chainPairs.PDEPoolPairs)
        .map(pair => ({
          [pair.Token1IDStr]: pair.Token1PoolValue,
          [pair.Token2IDStr]: pair.Token2PoolValue,
          keys: [pair.Token1IDStr, pair.Token2IDStr],
        }))
        .filter(pair => pair.keys.includes(COINS.PRV_ID))
        .value();

      let pairTokens = tokens
        .filter(token => token && pairs.find(pair => pair.keys.includes(token.id)));

      pairTokens = _(pairTokens)
        .map(token => {
          const pToken = pTokens.find(item => item.tokenId === token.id) || token;
          let priority = PRIORITY_LIST.indexOf(token?.id);
          priority = priority > -1 ? priority : PRIORITY_LIST.length + 1;

          return {
            ...pToken,
            id: pToken.tokenId || pToken.id,
            priority,
            verified: pToken.verified || pToken.isVerified,
          };
        })
        .orderBy(
          [
            'priority',
            'hasIcon',
            'verified',
          ],
          ['asc', 'desc', 'desc']
        )
        .value();

      setPairs(pairs);
      setPairTokens(pairTokens);
      setTokens(tokens);
      setShares(shares);

      const beaconHeight = Object.keys(chainPairs.PDEPoolPairs)[0].split('-')[1];
      const data = chainPairs.PDEPoolPairs;

      const USDT_PRV = data[`pdepool-${beaconHeight}-${PRV_ID}-${USDT_ID}`];
      const USDC_PRV = data[`pdepool-${beaconHeight}-${PRV_ID}-${USDC_ID}`];
      const DAI_PRV = data[`pdepool-${beaconHeight}-${PRV_ID}-${DAI_ID}`];

      const usdtToPrv = calculateOutputValue(USDT_PRV, USDT_ID, 500e6, PRV_ID);
      const usdtToUsdc = calculateOutputValue(USDC_PRV, PRV_ID, usdtToPrv, USDC_ID);
      const usdtToDai = calculateOutputValue(DAI_PRV, PRV_ID, usdtToPrv, DAI_ID);

      const usdcToPrv = calculateOutputValue(USDC_PRV, USDC_ID, 500e6, PRV_ID);
      const usdcToUsdt = calculateOutputValue(USDT_PRV, PRV_ID, usdcToPrv, USDT_ID);
      const usdcToDai = calculateOutputValue(DAI_PRV, PRV_ID, usdcToPrv, DAI_ID);

      setExtra({
        usdtToUsdc: usdtToUsdc / 1e6,
        usdcToDai: usdcToDai / 1e9,
        usdtToDai: usdtToDai / 1e9,
        prvToUsdc: calculateOutputValue(USDC_PRV, PRV_ID, 1e9, USDC_ID) / 1e6,
        prvToUsdt: calculateOutputValue(USDT_PRV, PRV_ID, 1e9, USDT_ID) / 1e6,
        usdcToUsdt: usdcToUsdt / 1e6,
      });
    } catch (error) {
      new ExHandler(error, MESSAGES.CAN_NOT_GET_PDEX_DATA).showErrorToast();
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadPairs();
  }, []);

  return (
    <WrappedComp
      {...{
        ...props,
        pairs,
        tokens,
        pairTokens,
        shares,
        loading,
        extra: extra,
        onLoadPairs: loadPairs,
      }}
    />
  );
};

export default withPairs;
