import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from '@src/components/core';
import { BtnChevron } from '@src/components/Button';
import stylesheet from './style';

const ExtraInfo = (props) => {
  const { left, right, style, rightStyle, wrapperStyle, message, ellipsizeMode, numberOfLines } = props;

  const LeftWrapper = typeof left === 'object' ? View : Text;
  const RightWrapper = typeof right === 'object' ? View : Text;

  const shouldShowMsg = !!message;

  const [state, setState] = React.useState({
    toggleMessage: false,
  });
  const { toggleMessage } = state;

  const handleToggleMsg = () => {
    setState({ ...state, toggleMessage: !toggleMessage });
  };

  return (
    <View>
      <View style={[stylesheet.wrapper, wrapperStyle]}>
        <LeftWrapper style={[stylesheet.text, stylesheet.textLeft, style]}>{left}</LeftWrapper>
        <RightWrapper
          numberOfLines={numberOfLines}
          ellipsizeMode={ellipsizeMode}
          style={[stylesheet.text, stylesheet.textRight, style, rightStyle, { flex: 1 }]}
        >
          {right}
        </RightWrapper>
        {shouldShowMsg && (
          <BtnChevron
            style={stylesheet.btnChevron}
            size={18}
            toggle={toggleMessage}
            onPress={handleToggleMsg}
          />
        )}
      </View>
      {toggleMessage && <Text style={[stylesheet.message]}>{message}</Text>}
    </View>
  );
};

ExtraInfo.propTypes = {
  left: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]).isRequired,
  right: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.number,
  ]).isRequired,
  style: PropTypes.object,
  wrapperStyle: PropTypes.object,
  rightStyle: PropTypes.object,
  message: PropTypes.string,
  ellipsizeMode: PropTypes.string,
  numberOfLines: PropTypes.number,
};

ExtraInfo.defaultProps = {
  style: null,
  rightStyle: null,
  wrapperStyle: null,
  message: null,
  ellipsizeMode: 'tail',
  numberOfLines: 1
};

export default ExtraInfo;
