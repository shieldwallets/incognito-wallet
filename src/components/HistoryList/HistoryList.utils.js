import {
  ConfirmedTx,
  FailedTx,
  SuccessTx,
} from '@src/services/wallet/WalletService';
import { CONSTANT_COMMONS } from '@src/constants';
import { COLORS } from '@src/styles';

export const getStatusData = (history) => {
  let { status, statusMessage, addressType} = history;
  if ([CONSTANT_COMMONS.HISTORY.TYPE.UNSHIELD, CONSTANT_COMMONS.HISTORY.TYPE.SHIELD].includes(addressType)) {
    let statusColor = COLORS.colorGreyBold;
    return { statusMessage, statusColor };
  }

  let statusColor;
  switch (status) {
  case CONSTANT_COMMONS.HISTORY.STATUS_TEXT.PENDING:
  case SuccessTx:
    statusMessage = 'Pending';
    break;
  case CONSTANT_COMMONS.HISTORY.STATUS_TEXT.SUCCESS:
  case ConfirmedTx:
    statusMessage = 'Complete';
    statusColor = COLORS.green;
    break;
  case CONSTANT_COMMONS.HISTORY.STATUS_TEXT.FAILED:
  case FailedTx:
    statusMessage = 'Failed';
    break;
  case CONSTANT_COMMONS.HISTORY.STATUS_TEXT.EXPIRED:
    statusMessage = 'Expired';
    break;
  default:
    statusMessage = '';
    statusColor = COLORS.colorGreyBold;
  }
  return {
    statusMessage,
    statusColor,
  };
};

export const getTypeData = (type, history, paymentAddress) => {
  let typeText;
  switch (type) {
  case CONSTANT_COMMONS.HISTORY.TYPE.UNSHIELD:
    typeText = 'Unshield';
    break;
  case CONSTANT_COMMONS.HISTORY.TYPE.SHIELD:
    typeText = history?.depositAddress ? 'Shield' : 'Receive';
    break;
  case CONSTANT_COMMONS.HISTORY.TYPE.SEND: {
    const isUTXO =
        history?.memo === 'Defragment' && history?.toAddress === paymentAddress;
    typeText = isUTXO
      ? 'Consolidation'
      : CONSTANT_COMMONS.HISTORY.META_DATA_TYPE[(history?.metaDataType)] ||
          'Send';
    if (typeText === CONSTANT_COMMONS.HISTORY.META_DATA_TYPE[90]) {
      typeText = 'Send';
    }
    break;
  }
  case CONSTANT_COMMONS.HISTORY.TYPE.RECEIVE:
    typeText = history?.typeText || 'Receive';
    break;
  }
  return {
    typeText,
  };
};
