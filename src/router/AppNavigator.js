import { THEME } from '@src/styles';
import { createStackNavigator } from 'react-navigation-stack';
import HeaderBar from '@src/components/HeaderBar';
import ROUTE_NAMES from './routeNames';
import { getRoutesNoHeader } from './routeNoHeader';

const RouteNoHeader = getRoutesNoHeader();

const AppNavigator = createStackNavigator(
  {
    ...RouteNoHeader,
  },
  {
    initialRouteName: ROUTE_NAMES.Wallet,
    defaultNavigationOptions: ({ navigation }) => {
      const { routeName } = navigation.state;
      // You can do whatever you like here to pick the title based on the route name
      const title = routeName;
      return {
        title,
        headerLayoutPreset: 'center',
        header: HeaderBar,
        headerTitleAlign: 'center',
        headerTitleStyle: { alignSelf: 'center', textAlign: 'center' },
        headerBackground: THEME.header.backgroundColor,
        gesturesEnabled: false,
      };
    },
  },
);

export default AppNavigator;
