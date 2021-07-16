import firebase from 'react-native-firebase';
import _ from 'lodash';
import DeviceInfo from 'react-native-device-info';
import { v4 } from 'uuid';

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

export const getToken = () => {
  // TODO: mockup firebase token
  return v4();
  // return firebase.messaging().getToken();
};
