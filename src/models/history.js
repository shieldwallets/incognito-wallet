import { CONSTANT_COMMONS } from '@src/constants';

// const CENTRALIZED_STATUS = {
//   FAILED: [14, 15, 18, 19],
//   SUCCESS: [3, 4, 5, 10],
//   EXPIRED: [16],
// };

// const DECENTRALIZED_STATUS = {
//   FAILED: [6, 9, 10, 15, 16, 23],
//   SUCCESS: [7, 12],
//   EXPIRED: [14],
// };

export const DECENTRALIZED_RECEIVE_TYPES = [ 27, 240, 252, 96, 242 ];

// const getStatusText = (status, isDecentralized) => {
//   if (isDecentralized) {
//     // decentralized token history
//     if (DECENTRALIZED_STATUS.FAILED.includes(status)) {
//       return CONSTANT_COMMONS.HISTORY.STATUS_TEXT.FAILED;
//     } else if (DECENTRALIZED_STATUS.SUCCESS.includes(status)) {
//       return CONSTANT_COMMONS.HISTORY.STATUS_TEXT.SUCCESS;
//     } else if (DECENTRALIZED_STATUS.EXPIRED.includes(status)) {
//       return CONSTANT_COMMONS.HISTORY.STATUS_TEXT.EXPIRED;
//     }
//     return CONSTANT_COMMONS.HISTORY.STATUS_TEXT.PENDING;
//   } else {
//     // centralized token history
//     if (CENTRALIZED_STATUS.FAILED.includes(status)) {
//       return CONSTANT_COMMONS.HISTORY.STATUS_TEXT.FAILED;
//     } else if (CENTRALIZED_STATUS.SUCCESS.includes(status)) {
//       return CONSTANT_COMMONS.HISTORY.STATUS_TEXT.SUCCESS;
//     } else if (CENTRALIZED_STATUS.EXPIRED.includes(status)) {
//       return CONSTANT_COMMONS.HISTORY.STATUS_TEXT.EXPIRED;
//     }
//     return CONSTANT_COMMONS.HISTORY.STATUS_TEXT.PENDING;
//   }
// };

class History {
  static parsePrivateTokenFromApi(data = {}) {
    const status = data?.Status;
    // const statusText = getStatusText(status, data.Decentralized);// ? why need this???
    const decentralized = data.Decentralized;
    const depositTmpAddress =
      data.AddressType === CONSTANT_COMMONS.HISTORY.TYPE.SHIELD && data.Address;
    const isShieldTx = !!depositTmpAddress;

    //const isDecentralized = decentralized; // now this is a number, not bool, remove this.

    const {
      STATUS_CODE_SHIELD_CENTRALIZED,      
    } = CONSTANT_COMMONS.HISTORY;

    // RESUME shield expired only for centralized coins.
    const canRetryExpiredDeposit = (
      decentralized === 0
      && data.AddressType === CONSTANT_COMMONS.HISTORY.TYPE.SHIELD
      && status === STATUS_CODE_SHIELD_CENTRALIZED.PENDING
    )      
    // Remove/cancel shield centrailzed only for pending/expired.
    const cancelable = (
      data.AddressType === CONSTANT_COMMONS.HISTORY.TYPE.SHIELD
      && decentralized === 0
      && (status === STATUS_CODE_SHIELD_CENTRALIZED.PENDING || status === STATUS_CODE_SHIELD_CENTRALIZED.EXPIRED)
    )
  
    const history = {
      id: data?.ID,
      createdAt: data?.CreatedAt,
      updatedAt: data.UpdatedAt,
      expiredAt: data.ExpiredAt,
      addressType: data.AddressType,
      status,
      decentralized,
      statusText: data.StatusDetail, //statusText, // no need this anymore..., ask Phuong.
      currencyType: data.CurrencyType,
      userPaymentAddress: data.UserPaymentAddress,
      erc20TokenAddress: data.Erc20TokenAddress,
      privacyTokenAddress: data.PrivacyTokenAddress,
      requestedAmount: data.RequestedAmount,
      receivedAmount: data?.ReceivedAmount || 0,
      incognitoAmount: data.IncognitoAmount,
      outchainTx: data.OutChainTx,
      inchainTx: data.InChainTx,
      // cancelable:
        // data.AddressType === CONSTANT_COMMONS.HISTORY.TYPE.SHIELD &&
        // [
        //   CONSTANT_COMMONS.HISTORY.STATUS_TEXT.EXPIRED,
        //   CONSTANT_COMMONS.HISTORY.STATUS_TEXT.PENDING,
        // ].includes(statusText), // Phuong remove.
      cancelable: cancelable, // Phuong add
      walletAddress: data.WalletAddress,
      // canRetryExpiredDeposit:
      //   !isDecentralized &&
      //   data.AddressType === CONSTANT_COMMONS.HISTORY.TYPE.SHIELD &&
      //   statusText === CONSTANT_COMMONS.HISTORY.STATUS_TEXT.EXPIRED, // Phuong remove
      canRetryExpiredDeposit: canRetryExpiredDeposit, // Phuong add.
      depositTmpAddress,
      privacyFee: Number(data?.OutChainPrivacyFee),
      tokenFee: Number(data?.OutChainTokenFee),
      burnPrivacyFee: Number(data?.BurnPrivacyFee),
      burnTokenFee: Number(data?.BurnTokenFee),
      incognitoTxID: data?.IncognitoTxToPayOutsideChainFee,
      statusMessage: data?.StatusMessage,
      statusDetail: data?.StatusDetail,
      isShieldTx,
      // isDecentralized, // same decentralized!
      incognitoTx: data?.IncognitoTx,
      memo: data?.Memo || data?.Info,
      shieldFee: data?.TokenFee || 0,
      receivedTx: data?.TxReceive || '',
    };
    return history;
  }
}

export default History;
