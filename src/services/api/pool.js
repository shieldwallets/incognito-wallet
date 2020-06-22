import http from '@src/services/http';
import { PoolConfigModel, UserCoinPoolModel } from '@models/pool';

export async function  getPoolConfig() {
  return http.get('pool/staker/configs')
    .then(data => new PoolConfigModel(data));
}

export async function getUserPoolData(paymentAddress) {
  const url = `/pool/staker/balance-info?p_stake_address=${paymentAddress}`;
  return http.get(url)
    .then(data => data.map(item => new UserCoinPoolModel(item)));
}
