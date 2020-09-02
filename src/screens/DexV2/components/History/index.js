/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { compose } from 'recompose';
import { View, Text, TouchableOpacity } from '@components/core';
import { withLayout_2 } from '@components/Layout';
import Header from '@components/Header/index';
import { VirtualizedList } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import ROUTE_NAMES from '@routers/routeNames';
import withPairs from '@screens/DexV2/components/pdexPair.enhance';
import withAccount from '@screens/DexV2/components/account.enhance';
import LoadingContainer from '@components/LoadingContainer/LoadingContainer';
import withOldHistories from '@screens/DexV2/components/oldHistories.enhance';
import { ArrowRightGreyIcon } from '@components/Icons';
import styles from './style';

const History = ({
  oldHistories,
}) => {
  const navigation = useNavigation();
  const viewDetail = (item) => {
    navigation.navigate(ROUTE_NAMES.TradeHistoryDetail, { history: item });
  };

  // eslint-disable-next-line react/prop-types
  const renderHistoryItem = ({ item }) => (
    <TouchableOpacity key={item.id} style={styles.historyItem} onPress={() => viewDetail(item)}>
      <Text style={styles.buttonTitle}>{item.type}</Text>
      <View style={styles.row}>
        <Text style={[styles.content, styles.ellipsis]} numberOfLines={1}>{item.description}</Text>
        <View style={[styles.row, styles.center]}>
          <Text style={styles.content} numberOfLines={1}>{item.status}</Text>
          <ArrowRightGreyIcon style={{ marginLeft: 10 }} />
        </View>
      </View>
    </TouchableOpacity>
  );

  const allHistories = [].concat(oldHistories);

  return (
    <View style={styles.wrapper}>
      <Header title="pDEX" />
      <Text style={[styles.buttonTitle, styles.historyTitle]}>Order history</Text>
      <View style={styles.wrapper}>
        {allHistories.length ? (
          <VirtualizedList
            data={allHistories}
            renderItem={renderHistoryItem}
            getItem={(data, index) => data[index]}
            getItemCount={data => data.length}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
        ) : <LoadingContainer /> }
      </View>
    </View>
  );
};

History.propTypes = {
  oldHistories: PropTypes.array,
};

History.defaultProps = {
  oldHistories: null,
};

export default compose(
  withLayout_2,
  withPairs,
  withAccount,
  withOldHistories,
)(History);
