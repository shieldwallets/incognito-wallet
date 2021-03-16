import firebase from 'react-native-firebase';
import _ from 'lodash';
import DeviceInfo from 'react-native-device-info';

const TAG = 'firebase';

export const logEvent = async (event, data = {}) => {
  if (!_.isEmpty(event)) {
    try {
      const deviceId = DeviceInfo.getUniqueId();
      const instance = firebase.analytics();
      const result = await instance.logEvent(event, {
        deviceId,
        ...data,
      });
      // console.debug('FIREBASE EVENT', event);
    } catch (error) {
      console.debug(TAG, 'logEvent error = ', error);
    }
  }
};

export const Events = {
  create_new_wallet: 'create_new_wallet',
  restore_wallet: 'restore_wallet',
  withdraw: 'withdraw',
  initiate_shielding_transaction: 'initiate_shielding_transaction',
  pdex_view_preview_swap: 'pdex_view_preview_swap',
  pdex_place_order: 'pdex_place_order',
  pdex_made_swap: 'pdex_made_swap',
  pdex_swap_failed: 'pdex_swap_failed',
  add_coin_list: 'add_coin_list',
  add_coin_manually: 'add_coin_manually',
  mint_coin: 'mint_coin',
  view_bulletin: 'view_bulletin',
  provide_coin: 'provide_coin',
  add_liquidity: 'add_liquidity',
  view_error_screen: 'view_error_screen',
  alert_network_busy: 'alert_network_busy',
  alert_previous_tx: 'alert_previous_tx',
  alert_topup_prv: 'alert_topup_prv',
  create_new_keychain: 'create_new_keychain'
};

export const getToken = () => {
  return firebase.messaging().getToken();
};
