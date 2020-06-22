class CoinConfigModel {
  constructor(data = {}) {
    if (!data) {
      return null;
    }

    const token = data.Token;

    this.id = token.TokenID;
    this.name = token.Name;
    this.symbol = token.Symbol;
    this.pDecimals = token.PDecimals;
    this.min = data.Min;
    this.max = data.Max;
    this.apr = data.APR;
    this.apy = data.APY;
  }
}

export class UserCoinPoolModel {
  constructor(data = {}) {
    if (!data) {
      return null;
    }

    this.id = data.CoinID;
    this.symbol = data.CoinSymbol;
    this.balance = data.Balance;
    this.rewardBalance = data.RewardBalance;
    this.pendingBalance = data.PendingBalance;
    this.unstakePendingBalance = data.UnstakePendingBalance;
    this.withdrawPendingBalance = data.WithdrawPendingBalance;
    this.lastUpdated = data.RewardDate;
  }
}

export class PoolConfigModel {
  constructor(data = {}) {
    if (!data) {
      return null;
    }

    this.masterAddress = data.MasterAddress;
    this.coins = data.Configs.map(item => new CoinConfigModel(item));
  }
}
