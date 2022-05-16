import React from 'react';
import {Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';

export const TestScreen = () => {
  const {t} = useTranslation();

  return (
    <View>
      <Text>{t('Welcome to React')}</Text>
    </View>
  );
};
