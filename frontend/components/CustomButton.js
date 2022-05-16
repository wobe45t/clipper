import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {CustomText} from '.';
import {colors} from '../constants';

export const CustomButton = ({onPress, size, children}) => {
  const _size = size || 'md'
  
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          borderWidth: 1,
          bodrderStyle: 'solid',
          padding: 10,
          borderColor: colors.sea,
          borderRadius: 10,
          margin: 5,
          alignItems: 'center',

        }}>
        <CustomText size={_size}>{children}</CustomText>
      </View>
    </TouchableOpacity>
  );
};
