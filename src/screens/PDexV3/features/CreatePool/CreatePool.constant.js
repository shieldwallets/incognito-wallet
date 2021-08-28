const TYPES = {
  ACTION_FETCHING: '[pDexV3][createPool] Fetching data',
  ACTION_FETCHED: '[pDexV3][createPool] Fetched data',
  ACTION_FETCH_FAIL: '[pDexV3][createPool] Fetch fail data',
  ACTION_UPDATE_CREATE_POOL_VALUE: '[pDexV3][contribute] Update create pool value',
  ACTION_SET_INPUT_TOKEN_IDSTR: '[pDexV3][createPool] Action set input tokenID',
  ACTION_SET_OUTPUT_TOKEN_IDSTR: '[pDexV3][createPool] Action set output tokenID',
  ACTION_FREE_CREATE_POOL: '[pDexV3][createPool] Action free create pool',
};

export const formConfigs = {
  formName: 'FORM_CREATE_POOL',
  inputToken: 'inputToken',
  outputToken: 'outputToken',
  amp: 'amp'
};


export default TYPES;
