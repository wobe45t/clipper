import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {TouchableOpacity} from 'react-native'
import {colors} from '../constants'

export const MIcon = ({onPress, name, size, color}) => {
  const _color = color || colors.p3
  const _size = size || 40

  return (
    <TouchableOpacity onPress={onPress}>
      <Icon name={name} size={_size} color={_color} />
    </TouchableOpacity>
  )
}