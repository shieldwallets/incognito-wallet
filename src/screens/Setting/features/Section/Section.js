import { Text, TouchableOpacity, View } from '@src/components/core';
import { Text5 } from '@src/components/core/Text';
import { ViewWithBorderBottom1 } from '@src/components/core/View';
import PropTypes from 'prop-types';
import React from 'react';
import {Row} from '@src/components';
import {ArrowRightGreyIcon} from '@components/Icons';
import { sectionStyle } from './Section.styled';

export const SectionItem = (
  { data: { title, desc, handlePress, styleItem = null, icon: CMPIcon } },
  lastItem,
) => {
  return (
    <TouchableOpacity
      style={[lastItem && sectionStyle.lastItem, styleItem]}
      onPress={handlePress}
    >
      <ViewWithBorderBottom1>
        <Row centerVertical spaceBetween>
          <Row centerVertical>
            {!!CMPIcon && (
              <View style={[sectionStyle.wrapIcon]}>
                {CMPIcon}
              </View>
            )}
            {title && <Text style={[sectionStyle.label]}>{title}</Text>}
          </Row>
          <ArrowRightGreyIcon style={{ width: 6, height: 10 }} />
        </Row>
        {desc && <Text5 style={[sectionStyle.desc]}>{desc}</Text5>}
      </ViewWithBorderBottom1>
    </TouchableOpacity>
  );
};

const Section = (props) => {
  const { label, items, customItems, headerRight, labelStyle, headerIcon: HeaderIcon } = props;
  return (
    <View>
      <ViewWithBorderBottom1>
        <Row style={sectionStyle.header}>
          <Row centerVertical>
            {!!HeaderIcon && (
              <View style={sectionStyle.wrapIcon}>
                {HeaderIcon}
              </View>
            )}
            <Text style={[sectionStyle.label, labelStyle]}>{label}</Text>
          </Row>
          {headerRight}
        </Row>
        {customItems ? (
          customItems
        ) : (
          <View>
            {items &&
              items.map((item, index) => (
                <SectionItem
                  key={`${item.title || item.desc}`}
                  data={item}
                  lastItem={index === items.length - 1}
                />
              ))}
          </View>
        )}
      </ViewWithBorderBottom1>
      
    </View>
  );
};

const itemShape = PropTypes.shape({
  icon: PropTypes.node,
  title: PropTypes.string,
  desc: PropTypes.string,
  handlePress: PropTypes.func,
  subDesc: PropTypes.string
});

Section.defaultProps = {
  label: '',
  items: undefined,
  customItems: undefined,
  headerRight: undefined,
  labelStyle: undefined,
  headerIcon: undefined
};
Section.propTypes = {
  label: PropTypes.string,
  items: PropTypes.arrayOf(itemShape),
  customItems: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
  headerRight: PropTypes.any,
  labelStyle: PropTypes.any,
  headerIcon: PropTypes.any
};

SectionItem.defaultProps = {
  data: undefined,
};
SectionItem.propTypes = {
  data: itemShape,
};

export default Section;
