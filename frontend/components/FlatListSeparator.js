import React from 'react';
import {View} from 'react-native';
import {colors} from '../constants/theme';

export const FlatListSeparator = () => {
  return (
    <View
      style={{
        marginTop: 3,
        marginBottom: 3,
        height: 0.5,
        width: '100%',
        backgroundColor: colors.sea,
      }}
    />
  );
};

