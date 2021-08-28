import React, {memo} from 'react';
import PropTypes from 'prop-types';
import {Row} from '@src/components';
import styled from '@components/RowSpaceText/RowSpaceText.styled';
import {Text} from '@components/core';
import {ActivityIndicator} from 'react-native';

const RowSpaceText = (props) => {
  const { label, value, loading } = props;
  return (
    <Row style={styled.hookContainer}>
      <Text style={styled.hookLabel}>{`${label}:`}</Text>
      <Row style={[styled.hookContainer, { marginBottom: 0 }]}>
        {
          loading ? (
            <ActivityIndicator size="small" />
          ) : (
            <Text style={styled.hookValue}>{value}</Text>
          )
        }
      </Row>
    </Row>
  );
};

RowSpaceText.defaultProps = {
  loading: false
};
RowSpaceText.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  loading: PropTypes.bool
};


export default memo(RowSpaceText);
