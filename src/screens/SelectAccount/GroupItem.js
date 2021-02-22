import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from '@src/components/core';
import theme from '@src/styles/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS, THEME } from '@src/styles';
import { generateTestId } from '@utils/misc';
import {TEST_ACCOUNT} from '@src/constants/elements';

const styled = StyleSheet.create({
  title: {
    ...THEME.text.boldTextStyleSuperMedium,
  },
  group: {
    marginBottom: 30
  },
});

const GroupItem = ({ name, child }) => {
  const [expand, setExpand] = useState(true);

  const toggleExpand = () => {
    setExpand(!expand);
  };

  return (
    <View accessible={false}>
      <TouchableOpacity accessible={false} style={[theme.FLEX.rowSpaceBetweenCenter, styled.group]} onPress={toggleExpand}>
        <Text
          {...generateTestId(TEST_ACCOUNT.LBL_WALLET_NAME)}
          style={styled.title}
        >
          {name}
        </Text>
        <Ionicons
          name={expand ? 'ios-arrow-up' : 'ios-arrow-down'}
          color={COLORS.newGrey}
          size={20}
          style={styled.arrow}
        />
      </TouchableOpacity>
      {expand && (
        <View accessible={false}>
          {child}
        </View>
      )}
    </View>
  );
};

GroupItem.propTypes = {
  name: PropTypes.string.isRequired,
  child: PropTypes.any.isRequired,
};

export default GroupItem;
