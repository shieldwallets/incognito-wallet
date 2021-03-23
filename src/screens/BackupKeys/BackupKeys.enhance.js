import { Platform, Share } from 'react-native';
import clipboard from '@src/services/clipboard';
import { ExHandler } from '@src/services/exception';
import storageService from '@src/services/storage';
import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { debounce , isEmpty } from 'lodash';
import rnfs from 'react-native-fs';
import SimpleInfo from '@src/components/SimpleInfo';
import { CONSTANT_KEYS } from '@src/constants';
import { compose } from 'recompose';
import { withLayout_2 } from '@src/components/Layout';
import { masterlessWalletSelector, noMasterLessSelector} from '@src/redux/selectors/masterKey';
import { loadListAccount } from '@services/wallet/WalletService';


const getNameKey = (obj) => {
  const name = Object.keys(obj)[0];
  const key = Object.values(obj)[0];

  return [name, key];
};

const convertToString = (masterless, noMasterless) => {
  let backupString = '';
  if (noMasterless?.length > 0) {
    backupString += '------MASTER KEYS------\n\n';
    backupString += noMasterless
      ?.map((pair) => {
        const [name, key] = getNameKey(pair);
        return `AccountName: ${name}\nPhrase: ${key}`;
      })
      ?.join('\n\n') || '';
  }
  if (masterless?.length > 0) {
    backupString += '\n\n------MASTERLESS------\n\n';
    backupString += masterless
      ?.map((pair) => {
        const [name, key] = getNameKey(pair);
        return `AccountName: ${name}\nPrivateKey: ${key}`;
      })
      ?.join('\n\n') || '';
  }
  return backupString;
};

const getBackupData = (accounts, masterKeys) => {
  try {
    const masterless = [];
    const noMasterless = [];
    if (accounts instanceof Array) {
      for (let account of accounts) {
        masterless.push({ [account?.name || account?.AccountName]: account?.PrivateKey });
      }
    }

    if (masterKeys instanceof Array) {
      for (let masterKey of masterKeys) {
        if (masterKey.name) {
          noMasterless.push({ [masterKey.name]: masterKey?.mnemonic });
        }
      }
    }
    return {
      masterless,
      noMasterless,
      backupDataStr: convertToString(masterless, noMasterless)
    };
  } catch (e) {
    new ExHandler(e, 'Please try again').showErrorToast();
  }
};

const enhance = (WrappedComponent) => (props) => {
  const { listAccount } = props;
  const masterKeys = useSelector(noMasterLessSelector);
  const masterlessWallet = useSelector(masterlessWalletSelector);
  const [state, setState] = React.useState({
    masterless: [],
    noMasterless: [],
    backupDataStr: '',
  });

  let masterlessAccounts = listAccount;

  const { masterless, noMasterless, backupDataStr } = state;

  const loadMasterlessAccounts = async () => {
    if (isEmpty(masterlessAccounts) && masterlessWallet) {
      masterlessAccounts = await loadListAccount(masterlessWallet) || [];
    }
    setState({ ...state, ...getBackupData(masterlessAccounts, masterKeys) });
  };

  React.useEffect(() => {
    loadMasterlessAccounts().then();
  }, [masterlessWallet]);

  const markBackedUp = () => {
    storageService.setItem(
      CONSTANT_KEYS.IS_BACKEDUP_ACCOUNT,
      JSON.stringify(true),
    );
  };

  const handleSaveFile = async () => {
    const time = moment().format('DD_MM_YYYY_HH_mm');

    const dir =
      Platform.OS === 'android'
        ? rnfs.ExternalDirectoryPath
        : rnfs.DocumentDirectoryPath;
    const path = `${dir}/incognito_${time}.txt`;

    await rnfs.writeFile(path, backupDataStr, 'utf8');

    const shared = await Share.share({
      message: backupDataStr,
      url: path,
      title: 'Backup your accounts',
    });
    const isShared = shared?.action === Share.sharedAction;

    if (isShared) {
      markBackedUp();
    }

    return { path, shared, isShared };
  };

  const handleCopyAll = () => {
    clipboard.set(backupDataStr, { copiedMessage: 'All keys copied' });
    markBackedUp();
  };

  if (noMasterless?.length === 0 && masterless?.length === 0) {
    return (
      <SimpleInfo
        text="No account to backup"
        subtext="Your wallet have no account to backup"
      />
    );
  } else {
    return (
      <WrappedComponent
        {...props}
        onSaveAs={debounce(handleSaveFile, 300)}
        onCopyAll={debounce(handleCopyAll, 300)}
        noMasterless={noMasterless}
        masterless={masterless}
        getNameKey={getNameKey}
        backupDataStr={backupDataStr}
      />
    );
  }

};

export default compose(
  withLayout_2,
  enhance,
);
