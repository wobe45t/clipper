import React from 'react';
import {SafeAreaView} from 'react-native';
import {styles as androidStyles} from '../constants/safeArea'

export const CustomSafeAreaView = ({children}) => {
  return (
    <SafeAreaView style={{flex: 1, ...androidStyles.AndroidSafeArea}}>
      {children}
    </SafeAreaView>
  );
};
