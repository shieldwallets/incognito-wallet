import { MAX_FEE_PER_TX } from '@components/EstimateFee/EstimateFee.utils';

const HEADER_TABS = {
  Add: 'Add',
  Remove: 'Remove',
  Withdraw: 'Withdraw'
};

const INPUT_FIELDS = {
  ADD_POOL: 'addPool',
  REMOVE_POOL: 'removePool',
  WITHDRAW: 'withDraw'
};

const TRANSACTION_FEE = MAX_FEE_PER_TX;
const USER_FEES = TRANSACTION_FEE + TRANSACTION_FEE;

const TYPE_LIQUIDITY = {
  ADD_POOL: 'Add liquidity',
  CREATE_POOL: 'Create liquidity',
  REMOVE_POOL: 'Remove liquidity',
  WITHDRAW_FEE: 'Withdraw fee',
};

const LIQUIDITY_TITLES = {
  ADD_POOL: {
    title: TYPE_LIQUIDITY.ADD_POOL,
    subTitle: 'Provide',
    successTitle: 'Liquidity added',
    successDesc: 'Please wait a few minutes for your\n' +
      'added liquidity to display.\n' +
      'Thanks for providing privacy.',
    tab: HEADER_TABS.Add,
  },
  CREATE_POOL: {
    title: TYPE_LIQUIDITY.CREATE_POOL,
    subTitle: 'Provide',
    successTitle: 'Liquidity added',
    successDesc: 'Please wait a few minutes for your\n' +
      'added liquidity to display.\n' +
      'Thanks for providing privacy.',
    tab: HEADER_TABS.Add,
  },
  REMOVE_POOL: {
    title: TYPE_LIQUIDITY.REMOVE_POOL,
    subTitle: 'Remove',
    successTitle: 'Liquidity removed',
    successDesc: (accountName) => `Please wait a few minutes for your ${accountName} to update`,
    tab: HEADER_TABS.Remove,
  },
  WITHDRAW_FEE: {
    title: TYPE_LIQUIDITY.WITHDRAW_FEE,
    subTitle: 'Withdraw',
    successTitle: 'Liquidity withdrawn',
    successDesc: (accountName) => `Please wait a few minutes for your ${accountName} to update`,
    tab: HEADER_TABS.Withdraw,
  }
};

const LIQUIDITY_STATUS = {
  WAITING: 'waiting',
  MATCHED: 'matched',
  MATCHED_N_RETURNED: 'matchedNReturned',
  REFUND: 'refund',
  FAIL: 'fail',
};

const LIQUIDITY_STATUS_MESSAGE = {
  PENDING: 'Pending',
  SUCCESSFUL: 'Successful',
  REFUNDED: 'Refunded',
  PART_REFUNFED: 'part-refunded',
  FAILED: 'Fail',
  WAITING: 'Waiting'
};

const SHARE_FIELD = {
  WITHDRAW_SHARE: 'share',
  WITHDRAW_FEE_SHARE: 'shareFee'
};

export {
  HEADER_TABS,
  INPUT_FIELDS,
  USER_FEES,
  TRANSACTION_FEE,
  LIQUIDITY_TITLES,
  LIQUIDITY_STATUS,
  LIQUIDITY_STATUS_MESSAGE,
  SHARE_FIELD,
};
