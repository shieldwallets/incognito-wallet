import { Text, TouchableOpacity, View } from '@src/components/core';
import PropTypes from 'prop-types';
import React from 'react';
import { generateTestId } from '@utils/misc';
import { TEST_SETTING } from '@src/constants/elements';
import { sectionStyle } from './Section.styled';

export const SectionItem = (
  { data: { title, desc, handlePress, subDesc, styleItem = null }, testId },
  lastItem,
) => {
  return (
    <TouchableOpacity
      accessible={false}
      style={[sectionStyle.item, lastItem && sectionStyle.lastItem, styleItem]}
      onPress={handlePress}
      {...generateTestId(TEST_SETTING.BTN_SECTION)}
    >
      <View style={sectionStyle.infoContainer}>
        {title && (
          <Text
            style={sectionStyle.label}
            {...generateTestId(testId || TEST_SETTING.LBL_TITLE)}
          >
            {title}
          </Text>
        )}
        {desc && (
          <Text
            {...generateTestId(TEST_SETTING.LBL_DESC)}
            style={sectionStyle.desc}
          >{desc}
          </Text>
        )}
        {subDesc && (
          <Text
            {...generateTestId(TEST_SETTING.LBL_SUB_DESC)}
            style={[sectionStyle.desc, sectionStyle.subDesc]}
          >
            {subDesc}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const Section = ({ label, items, customItems, headerRight, labelStyle }) => {
  return (
    <View accessible={false} style={sectionStyle.container}>
      <View style={sectionStyle.header}>
        <Text
          style={[sectionStyle.label, labelStyle]}
          {...generateTestId(TEST_SETTING.LBL_TITLE)}
        >
          {label}
        </Text>
        {headerRight}
      </View>
      {customItems ? (
        customItems
      ) : (
        <View style={sectionStyle.items}>
          {items &&
            items.map((item, index) => (
              <SectionItem
                key={index}
                data={item}
                lastItem={index === items.length - 1}
              />
            ))}
        </View>
      )}
    </View>
  );
};

const itemShape = PropTypes.shape({
  icon: PropTypes.node,
  title: PropTypes.string,
  desc: PropTypes.string,
  handlePress: PropTypes.func,
});

Section.defaultProps = {
  label: '',
  items: undefined,
  customItems: undefined,
};
Section.propTypes = {
  label: PropTypes.string,
  items: PropTypes.arrayOf(itemShape),
  customItems: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
};

SectionItem.defaultProps = {
  data: undefined,
  testId: '',
};
SectionItem.propTypes = {
  data: itemShape,
  testId: PropTypes.string,
};

export default Section;
