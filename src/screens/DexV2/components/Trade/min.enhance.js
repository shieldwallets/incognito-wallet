import React from 'react';

const withMin = WrappedComp => (props) => {
  const [min, setMin] = React.useState('99');

  return (
    <WrappedComp
      {...{
        ...props,
        min,
        onChangeMin: setMin,
      }}
    />
  );
};

export default withMin;
