import React from 'react';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import { SectionItem as Section } from '@screens/Setting/features/Section';
import {ConvertIcon} from '@components/Icons';


const ConvertCoinsSection = React.memo(() => {
  const navigation = useNavigation();
  const handleGoConvert = () => {
    navigation.navigate(routeNames.ConvertTokenList);
  };

  return (
    <Section
      data={{
        title: 'Convert UTXOs Version 1',
        desc: 'Convert UTXOs Version 1 for each keychain',
        handlePress: handleGoConvert,
        icon: <ConvertIcon />
      }}
    />
  );
});

ConvertCoinsSection.propTypes = {};

export default ConvertCoinsSection;
