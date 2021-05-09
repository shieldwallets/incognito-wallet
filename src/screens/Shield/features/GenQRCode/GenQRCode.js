import React from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { selectedPrivacySeleclor } from '@src/redux/selectors';
import { shieldDataSelector } from '@screens/Shield/Shield.selector';
import QrCodeGenerate from '@src/components/QrCodeGenerate';
import PropTypes from 'prop-types';
import { CopiableTextDefault as CopiableText } from '@src/components/CopiableText';
import LoadingContainer from '@src/components/LoadingContainer';
import { ButtonBasic } from '@src/components/Button';
import { ClockWiseIcon } from '@src/components/Icons';
import Tooltip from '@src/components/Tooltip/Tooltip';
import { COLORS } from '@src/styles';
import { ScrollView } from '@src/components/core';
import { isEmpty } from 'lodash';
import withGenQRCode from './GenQRCode.enhance';
import { styled } from './GenQRCode.styled';

const NormalText = React.memo((props) => {
  const { text, style = null, children = null } = props;
  return (
    <Text style={[styled.text, style]}>
      {text}
      {children}
    </Text>
  );
});

const ShieldError = React.memo(({ handleShield }) => {
  return (
    <View style={styled.errorContainer}>
      <ClockWiseIcon />
      <Text style={[styled.errorText, { marginTop: 30 }]}>
        {'We seem to have hit a snag. Simply\ntap to try again.'}
      </Text>
      <ButtonBasic
        btnStyle={styled.btnRetry}
        titleStyle={styled.titleBtnRetry}
        onPress={handleShield}
        title="Try again"
      />
      <Text style={styled.errorText}>
        {'If that doesn’t work,\n please come back in 60 minutes.'}
      </Text>
    </View>
  );
});

const Extra = () => {
  const { address, min, expiredAt, isShieldAddressDecentralized } = useSelector(shieldDataSelector);
  const selectedPrivacy = useSelector(selectedPrivacySeleclor.selectedPrivacy);

  const renderShieldIncAddress = () => (
    <>
      <NormalText style={styled.title}>
        {'Send to this shielding\naddress '}
        <Text style={[styled.boldText]}>once only.</Text>
      </NormalText>
      <View style={styled.qrCode}>
        <QrCodeGenerate value={address} size={175} />
      </View>
      <View style={styled.hook}>
        {
          !isEmpty(expiredAt) && (
            <NormalText text="Expires at: ">
              <Text style={[styled.boldText, styled.countdown]}>
                {expiredAt}
              </Text>
            </NormalText>
          )
        }
        {min && (
          <>
            <NormalText text="Minimum: ">
              <Text style={[styled.boldText]}>
                {`${min} ${selectedPrivacy?.externalSymbol ||
                selectedPrivacy?.symbol}`}
              </Text>
            </NormalText>
            <NormalText
              text="Smaller amounts will not be processed."
              style={styled.smallText}
            />
          </>
        )}
      </View>
      <CopiableText data={address} />
      <NormalText
        text={
          'If sending from an exchange, please take\nwithdrawal times into account.'
        }
        style={{ marginTop: 30 }}
      />
      <NormalText
        text={
          'It may be more reliable to use a normal\nwallet as an intermediary.'
        }
        style={{ marginTop: 10 }}
      />
    </>
  );

  const renderShieldUserAddress = () => (
    <>
      <NormalText style={styled.title}>
        Send to this shielding address
      </NormalText>
      <View style={styled.qrCode}>
        <QrCodeGenerate value={address} size={175} />
      </View>
      <CopiableText data={address} />
    </>
  );

  return (
    <ScrollView style={styled.scrollview}>
      <View style={styled.extra}>
        {isShieldAddressDecentralized ? renderShieldUserAddress() : renderShieldIncAddress()}
      </View>
    </ScrollView>
  );
};

const Content = () => {
  return (
    <View style={styled.content}>
      <Text style={styled.textContent}>
        Make sure you have selected the right coin
      </Text>
    </View>
  );
};

const GenQRCode = (props) => {
  const { hasError, handleShield, isFetching } = props;
  const [toggle, setToggle] = React.useState(true);
  React.useEffect(() => {
    if (toggle) {
      const timeout = setTimeout(() => {
        setToggle(false);
      }, 3000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [toggle]);
  const renderComponent = () => {
    if (isFetching) {
      return <LoadingContainer />;
    }
    if (hasError) {
      return <ShieldError handleShield={handleShield} />;
    }
    return <Extra {...props} />;
  };
  return (
    <View style={styled.container}>
      {toggle && (
        <Tooltip
          content={<Content />}
          containerStyle={{
            backgroundColor: COLORS.black,
            borderRadius: 11,
            paddingBottom: 0,
          }}
          triangleStyle={{
            top: -50,
            right: 5,
            borderBottomColor: COLORS.black,
            transform: [{ rotate: '0deg' }],
          }}
        />
      )}
      {renderComponent()}
    </View>
  );
};

NormalText.propTypes = {
  text: PropTypes.string.isRequired,
};

Extra.propTypes = {};

GenQRCode.propTypes = {
  hasError: PropTypes.bool.isRequired,
  handleShield: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

export default withGenQRCode(GenQRCode);
