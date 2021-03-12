import React from 'react';
import { SectionItem as Section } from '@screens/Setting/features/Section';
import PropTypes from 'prop-types';

const ExportCSVSection = (props) => {
  const { handlePress } = props;
  return (
    <Section
      data={{
        title: 'Report',
        desc: 'Export balance changes of the current keychain',
        handlePress: handlePress,
      }}
    />
  );
};

ExportCSVSection.propTypes = {
  handlePress: PropTypes.func,
};

ExportCSVSection.defaultProps = {
  handlePress: null,
};

export default React.memo(ExportCSVSection);
