import { combineReducers } from 'redux';
import { homeReducer as home } from './features/Home';
import { portfolioReducer as portfolio } from './features/Portfolio';
import { poolsReducer as pools } from './features/Pools';
import { swapReducer as swap } from './features/Swap';
import { orderLimitReducer as orderLimit } from './features/OrderLimit';
import { contributeReducer as contribute } from './features/Contribute';
import { tradeReducer as trade } from './features/Trade';
import { chartReducer as chart } from './features/Chart';
import { createPoolReducer as createPool } from './features/CreatePool';
import { contributeHistoriesReducer as contributeHistories } from './features/ContributeHistories';
import { removePoolHistoriesReducer as removePoolHistories } from './features/RemovePoolHistories';
import { withdrawRewardHistoriesReducer as withdrawRewardHistories } from './features/WithdrawRewardHistories';
import { removePoolReducer as removePool } from './features/RemovePool';
import { provideHomeReducer as provide } from './features/ProvideHome';

const pDexV3Reducer = combineReducers({
  home,
  portfolio,
  pools,
  swap,
  orderLimit,
  contribute,
  trade,
  chart,
  createPool,
  contributeHistories,
  removePoolHistories,
  withdrawRewardHistories,
  removePool,
  provide,
});

export default pDexV3Reducer;
