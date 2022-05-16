import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Pressable} from 'react-native';
import {colors} from '../constants/theme'

export const ModalItem = ({children, variant, icon, onPress}) => {
  const _color = variant == 'warning' ? colors.redWarning : colors.p3
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: 10,
          flexDirection: 'row',
        }}>
        <View style={{marginRight: 5}}>
          <Text style={{color: _color}}>
          {icon}
          </Text>
        </View>
        <Text style={{fontSize: 20, color: _color, textAlign: 'center'}}>
          {children}
        </Text>
      </View>
    </TouchableOpacity>
  );
};