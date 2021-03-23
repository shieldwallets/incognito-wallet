import React from 'react';
import MainLayout from '@components/MainLayout';
import { RoundCornerButton, Text } from '@components/core';
import { StyleSheet } from 'react-native';
import { THEME } from '@src/styles';
import Loading from '@screens/DexV2/components/Loading';
import PropTypes from 'prop-types';
import enhanceExportCSV from './ExportCSV.enhance';

const styles = StyleSheet.create({
  text: {
    ...THEME.text.mediumTextMotto,
  },
  button: {
    marginTop: 50,
  },
});

const ExportCSV = (props) => {
  const { loadingExportCSV, exportCSV } = props;

  const handlePressExportCSV = () => {
    exportCSV();
  };

  return (
    <MainLayout header="Reporting" scrollable>
      <Text style={styles.text}>
        {'We need file and folder permission to export csv and stored it in your device. Please grant us the permission. \n\n We will export transaction data of trade, provide and withdraw node rewards.'}
      </Text>
      <RoundCornerButton
        style={styles.button}
        title="Export"
        onPress={handlePressExportCSV}
      />
      <Loading open={loadingExportCSV} />
    </MainLayout>
  );
};

ExportCSV.propTypes = {
  loadingExportCSV: PropTypes.bool,
  exportCSV: PropTypes.func,
};

ExportCSV.defaultProps = {
  loadingExportCSV: false,
  exportCSV: null,
};

export default enhanceExportCSV(React.memo(ExportCSV));
