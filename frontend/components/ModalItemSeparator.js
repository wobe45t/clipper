import React from 'react';
import {View} from 'react-native';
import {colors} from '../constants/theme'

export const ModalItemSeparator = () => {
  return (
    <View
      style={{
        marginBottom: 2,
        marginTop: 2,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: colors.p4,
        width: '100%',
      }}></View>
  );
};
