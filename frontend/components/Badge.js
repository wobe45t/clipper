import React from 'react';
import {View, Text} from 'react-native';
import {colors} from '../constants/theme'

export const Badge = ({children, color, size}) => {

  const fontSize = size == 'small' ? 14 : size == 'medium' ? 18 : size == 'big' ? 22 : 14 
  const padding = size == 'small' ? 2 : size == 'medium' ? 6 : size == 'big' ? 10 : 2 

  return (
    <View
      style={{
        // display: 'flex',
        backgroundColor: color,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
      }}>
        <View style={{padding: padding}}>
          <Text style={{fontSize: fontSize, textTransform: 'uppercase', letterSpacing: 2, textAlign: 'center'}}>
            {children}
          </Text>
        </View>
    </View>
  );
};
