const PROTOCOLS = {
  OX: '0x',
  KYBER: 'Kyber',
  UNISWAP: 'Uniswap',
};

const OX_TRADE_ADDRESS = '0x4C6e4aC9a49b78EDc7e885ad0281fE9D84dc8341';
const KYBER_TRADE_ADDRESS = global?.isMainnet ?
  '0xcf78D5096a67ffE3105d1B08eDb87321dFa82e3D' :
  '0x434709450d861a16A75488D6b96b4b1c5492Ae17';

export default {
  PROTOCOLS,
  KYBER_TRADE_ADDRESS,
  OX_TRADE_ADDRESS,
};
