import {setTokenHeader} from '@src/services/http';
import {getToken as getUserToken} from '@src/services/api/user';
import LocalDatabase from '@utils/LocalDatabase';
import {CustomError, ErrorCode} from './exception';

export const getToken = async () => {
  const firebaseToken = 'token';
  const uniqueId = 'siris-device';
  const tokenData = await getUserToken(uniqueId, firebaseToken);

  await LocalDatabase.saveDeviceId(uniqueId);
  const { token } = tokenData;

  return token;
};

export const login = async () => {
  try {
    const token = await getToken();
    setTokenHeader(token);
    return token;
  } catch (e) {
    throw new CustomError(ErrorCode.user_login_failed, { rawError: e });
  }
};

global.login = login;
