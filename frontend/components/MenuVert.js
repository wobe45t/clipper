import React from 'react'
import {TouchableOpacity} from 'react-native';
import {default as Icon} from 'react-native-vector-icons/MaterialIcons';

export const MenuVert = ({onPress}) => {
  return (
    <TouchableOpacity
      onPress={onPress}>
      <Icon name="more-vert" size={30} />
    </TouchableOpacity>
  );
};
