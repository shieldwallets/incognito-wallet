import { COLORS } from '@src/styles';
import {
  ACCOUNT_CONSTANT,
  Validator,
} from 'incognito-chain-web-js/build/wallet';

export const {
  TX_STATUS,
  STATUS_CODE_SHIELD_DECENTRALIZED,
  STATUS_CODE_SHIELD_CENTRALIZED,
  STATUS_CODE_UNSHIELD_DECENTRALIZED,
  STATUS_CODE_UNSHIELD_CENTRALIZED,
} = ACCOUNT_CONSTANT;

export const TX_STATUS_COLOR = {
  [TX_STATUS.PROCESSING]: COLORS.colorGreyBold,
  [TX_STATUS.TXSTATUS_UNKNOWN]: COLORS.orange,
  [TX_STATUS.TXSTATUS_FAILED]: COLORS.red,
  [TX_STATUS.TXSTATUS_PENDING]: COLORS.colorBlue,
  [TX_STATUS.TXSTATUS_SUCCESS]: COLORS.green,
};

export const getStatusColorShield = (history) => {
  let statusColor = '';
  try {
    new Validator('getStatusColorShield-history', history).required().object();
    const { decentralized, status } = history;
    switch (decentralized) {
    case 0: {
      // centralized
      if (STATUS_CODE_SHIELD_CENTRALIZED.COMPLETE.includes(status)) {
        statusColor = COLORS.green;
      } else {
        statusColor = COLORS.colorGreyBold;
      }
      break;
    }
    case 1:
    case 2: {
      // decetralized
      if (STATUS_CODE_SHIELD_DECENTRALIZED.COMPLETE.includes(status)) {
        statusColor = COLORS.green;
      } else {
        statusColor = COLORS.colorGreyBold;
      }
      break;
    }
    default:
      break;
    }
  } catch (error) {
    console.log('getStatusColorShield', error);
  }
  return statusColor;
};

export const getStatusColorUnshield = (history) => {
  let statusColor = '';
  try {
    new Validator('getStatusColorUnshield-history', history)
      .required()
      .object();
    const { decentralized, status } = history;
    switch (decentralized) {
    case 0: {
      // centralized
      if (STATUS_CODE_UNSHIELD_CENTRALIZED.COMPLETE === status) {
        statusColor = COLORS.green;
      } else {
        statusColor = COLORS.colorGreyBold;
      }
      break;
    }
    case 1:
    case 2: {
      // decetralized
      if (STATUS_CODE_UNSHIELD_DECENTRALIZED.COMPLETE === status) {
        statusColor = COLORS.green;
      } else {
        statusColor = COLORS.colorGreyBold;
      }
      break;
    }
    default:
      break;
    }
  } catch (error) {
    console.log('getStatusColorUnshield', error);
  }

  return statusColor;
};
