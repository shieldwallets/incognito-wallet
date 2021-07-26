import React from 'react';
import Swipeout from 'react-native-swipeout';
import {
  LoadingContainer,
  Text,
  TouchableOpacity,
  View,
} from '@src/components/core';
import { FlatList } from '@components/core/FlatList';
import { COLORS } from '@src/styles';
import PropTypes from 'prop-types';
import { generateTestId } from '@utils/misc';
import { TOKEN } from '@src/constants/elements';
import trim from 'lodash/trim';
import { useNavigation } from 'react-navigation-hooks';
import { useDispatch } from 'react-redux';
import { actionSetSelectedTx } from '@src/redux/actions/history';
import routeNames from '@src/router/routeNames';
import styleSheet from './History.styled';

const HistoryItemWrapper = ({ history, onCancelEtaHistory, ...otherProps }) =>
  React.useMemo(() => {
    const component = <HistoryItem history={history} {...otherProps} />;
    if (history?.cancelable) {
      return (
        <Swipeout
          autoClose
          style={{
            backgroundColor: 'transparent',
          }}
          right={[
            {
              text: 'Remove',
              backgroundColor: COLORS.red,
              onPress: () => onCancelEtaHistory(history),
            },
          ]}
        >
          {component}
        </Swipeout>
      );
    }
    return component;
  }, [history]);

const NormalText = React.memo(({ style, text, testId, ...rest }) => (
  <Text
    numberOfLines={1}
    style={[styleSheet.text, style]}
    ellipsizeMode="tail"
    {...generateTestId(testId)}
    {...rest}
  >
    {trim(text)}
  </Text>
));

const HistoryItem = React.memo(({ history }) => {
  const { amountStr, txTypeStr, timeStr, statusStr } = history;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  if (!history) {
    return null;
  }
  const onPress = () => {
    dispatch(actionSetSelectedTx(history));
    navigation.navigate(routeNames.TxHistoryDetail);
  };
  return (
    <TouchableOpacity onPress={onPress} style={styleSheet.itemContainer}>
      <View style={[styleSheet.row, styleSheet.rowTop]}>
        <NormalText
          text={txTypeStr}
          style={styleSheet.title}
          testId={TOKEN.TRANSACTION_TYPE}
        />
        <NormalText
          text={amountStr}
          style={styleSheet.title}
          testId={TOKEN.TRANSACTION_CONTENT}
        />
      </View>
      <View style={styleSheet.row}>
        <NormalText
          style={styleSheet.desc}
          text={timeStr}
          testId={TOKEN.TRANSACTION_TIME}
        />
        <NormalText
          style={[styleSheet.desc]}
          text={statusStr}
          testId={TOKEN.TRANSACTION_STATUS}
        />
      </View>
    </TouchableOpacity>
  );
});

const HistoryList = (props) => {
  const {
    histories,
    showEmpty,
    renderEmpty,
    refreshing,
    onRefreshHistoryList,
    onLoadmoreHistory,
    onCancelEtaHistory,
    loading,
  } = props;
  const initing = loading && histories.length === 0;
  if (initing) {
    return (
      <LoadingContainer
        containerStyled={{
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      />
    );
  }
  return (
    <FlatList
      data={histories}
      renderItem={({ item: history }) => {
        return <HistoryItemWrapper {...{ history, onCancelEtaHistory }} />;
      }}
      keyExtractor={(item) => item?.txId || item?.id}
      onRefresh={() =>
        typeof onRefreshHistoryList === 'function' && onRefreshHistoryList()
      }
      refreshing={refreshing && !initing}
      onEndReached={() =>
        typeof onLoadmoreHistory === 'function' && onLoadmoreHistory()
      }
      ListFooterComponent={<View style={{ marginBottom: 30 }} />}
      ListEmptyComponent={
        showEmpty && typeof renderEmpty === 'function' && renderEmpty()
      }
    />
  );
};

HistoryList.defaultProps = {
  histories: [],
  onCancelEtaHistory: null,
  onRefreshHistoryList: null,
  refreshing: false,
  onLoadmoreHistory: null,
  oversize: false,
  renderEmpty: null,
  showEmpty: false,
};

HistoryList.propTypes = {
  histories: PropTypes.array,
  onCancelEtaHistory: PropTypes.func,
  onRefreshHistoryList: PropTypes.func,
  onLoadmoreHistory: PropTypes.func,
  refreshing: PropTypes.bool,
  oversize: PropTypes.bool,
  renderEmpty: PropTypes.func,
  showEmpty: PropTypes.bool,
};

export default React.memo(HistoryList);
