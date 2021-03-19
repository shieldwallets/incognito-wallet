import React from 'react';

const withERC20 = WrappedComp => (props) => {
  return (
    <WrappedComp
      {...{
        ...props,
        isErc20: false,
      }}
    />
  );
};

export default withERC20;
