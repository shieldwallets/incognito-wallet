import { navigationOptionsHandler } from '@src/utils/router';
import SelectAccount from '@screens/SelectAccount';
import Wallet from '@screens/Wallet/features/Home';
import ReceiveCrypto from '@screens/Wallet/features/ReceiveCrypto';
import TokenSelectScreen from '@components/TokenSelectScreen';
import Trade from '@screens/DexV2';
import TradeConfirm from '@screens/DexV2/components/TradeConfirm';
import TradeHistory from '@screens/DexV2/components/History';
import TradeHistoryDetail from '@screens/DexV2/components/HistoryDetail';
import TxHistoryDetail from '@screens/Wallet/features/TxHistoryDetail';
import ImportAccount from '@src/screens/Account/features/ImportAccount';
import routeNames from './routeNames';

const routes = [
  {
    screen: SelectAccount,
    name: routeNames.SelectAccount,
  },
  {
    screen: Wallet,
    name: routeNames.Wallet,
  },
  {
    screen: ReceiveCrypto,
    name: routeNames.ReceiveCrypto,
  },
  {
    screen: Trade,
    name: routeNames.Trade,
  },
  {
    screen: TradeConfirm,
    name: routeNames.TradeConfirm,
  },
  {
    screen: TradeHistory,
    name: routeNames.TradeHistory,
  },
  {
    screen: TradeHistoryDetail,
    name: routeNames.TradeHistoryDetail,
  },
  {
    screen: TokenSelectScreen,
    name: routeNames.TokenSelectScreen,
  },
  {
    screen: TxHistoryDetail,
    name: routeNames.TxHistoryDetail,
  },
  {
    screen: ImportAccount,
    name: routeNames.ImportAccount,
  },
];

export const getRoutesNoHeader = () =>
  routes.reduce((result, route) => {
    result[(route?.name)] = navigationOptionsHandler(route?.screen, {
      header: () => null,
    });
    return result;
  }, {});
