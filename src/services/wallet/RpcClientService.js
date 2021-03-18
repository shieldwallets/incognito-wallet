import {
  RpcClient,
  Wallet,
} from 'incognito-chain-web-js/build/wallet';
import { CustomError, ErrorCode, ExHandler } from '../exception';

let lastPDEStateData = null;
let lastBeaconHeight = null;

function getRpcClient() {
  return Wallet.RpcClient;
}

function setRpcClientInterceptor() {
  const instance = Wallet.RpcClient?.rpcHttpService?.axios;

  instance?.interceptors.response.use(
    (res) => {
      return Promise.resolve(res);
    },
    (errorData) => {
      const errResponse = errorData?.response;

      // can not get response, alert to user
      if (errorData?.isAxiosError && !errResponse) {
        return new ExHandler(
          new CustomError(ErrorCode.network_make_request_failed),
        ).throw();
      }

      return Promise.reject(errorData);
    },
  );
}

export function setRpcClient(server, username, password) {
  Wallet.RpcClient = new RpcClient(server, username, password);
}

export async function getStakingAmount(type) {
  let resp;
  try {
    resp = await getRpcClient().getStakingAmount(type);
  } catch (e) {
    throw e;
  }
  return resp.res;
}

export function isExchangeRatePToken(tokenID) {
  if (typeof tokenID !== 'string') throw new Error('tokenID must be a string');

  return getRpcClient().isExchangeRatePToken(tokenID);
}

export async function getPDEPairs() {
  const client = await getRpcClient();
  const beaconHeight = await client.getBeaconHeight();

  if (lastBeaconHeight !== beaconHeight) {
    const data = await client.getPDEState(beaconHeight);
    lastPDEStateData = data;
  }

  return lastPDEStateData;
}

export async function getPDETradeStatus(txId) {
  const client = await getRpcClient();
  return client.getPDETradeStatus(txId);
}

export async function getPDEContributionStatus(pairId) {
  const client = await getRpcClient();
  const res = await client.getPDEContributionStatusV2(pairId);
  return res.state;
}

export async function getPDEWithdrawalStatus(txId) {
  const client = await getRpcClient();
  return client.getPDEWithdrawalStatus(txId);
}

export function getBlockChainInfo() {
  return getRpcClient().getBlockChainInfo();
}

export function getBeaconBestStateDetail() {
  return getRpcClient().getBeaconBestStateDetail();
}

export function listRewardAmount() {
  return getRpcClient().listRewardAmount();
}

export async function getTransactionByHash(txId) {
  const client = await getRpcClient();
  return client.getTransactionByHash(txId);
}

export async function getEstimateFeePerKB(paymentAddress) {
  const client = await getRpcClient();
  return client.getEstimateFeePerKB(paymentAddress);
}

export async function getNodeTime() {
  const client = await getRpcClient();
  return client.getNodeTime();
}

export async function getPublicKeyFromPaymentAddress(paymentAddress) {
  const client = await getRpcClient();
  const data = {
    jsonrpc: '1.0',
    method: 'getpublickeyfrompaymentaddress',
    params: [paymentAddress],
    id: 1,
  };

  const response = await client.rpcHttpService.postRequest(data);

  if (response.status !== 200) {
    throw new Error('Can\'t request API check has serial number derivator');
  } else if (response.data.Error) {
    throw response.data.Error;
  }

  return response.data.Result.PublicKeyInBase58Check;
}

export const getReceiveHistoryByRPC = async ({
  PaymentAddress,
  ReadonlyKey,
  Skip = 0,
  Limit = 10,
  TokenID,
}) => {
  const client = await getRpcClient();
  const data = {
    jsonrpc: '1.0',
    method: 'gettransactionbyreceiverv2',
    params: [
      {
        PaymentAddress,
        ReadonlyKey,
        Skip,
        Limit,
        TokenID,
      },
    ],
    id: 1,
  };
  const response = await client.rpcHttpService.postRequest(data);
  if (response.status !== 200) {
    throw new Error('Can\'t request API');
  } else if (response.data.Error) {
    throw response.data.Error;
  }
  const txs = response.data.Result?.ReceivedTransactions;
  const simpleTxs = txs.map(item => ({
    InputSerialNumbers: item.InputSerialNumbers,
    Hash: item.TxDetail.Hash,
    LockTime: item.TxDetail.LockTime,
    ReceivedAmounts: item.ReceivedAmounts,
    Metadata: item.TxDetail.Metadata,

  }));

  return simpleTxs;
};

export const getTxTransactionByHash = async (txId) => {
  const client = await getRpcClient();
  const data = {
    jsonrpc: '1.0',
    method: 'gettransactionbyhash',
    params: [txId],
    id: 3,
  };
  const response = await client.rpcHttpService.postRequest(data);
  if (response.status !== 200) {
    throw new Error('Can\'t request API');
  } else if (response.data.Error) {
    throw response.data.Error;
  }
  return response.data.Result;
};

setRpcClientInterceptor();
