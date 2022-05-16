import React, {useEffect, useState} from 'react';
import {BottomTabBar} from '@react-navigation/bottom-tabs';
import {View} from 'react-native';
import {BarPlayer} from '.';
import {useRecoilValue} from 'recoil';
import {playerPlaylistAtom} from '../state';

export const CustomTabBar = props => {
  const playerPlaylist = useRecoilValue(playerPlaylistAtom);
  return (
    <View>
      {playerPlaylist.id && <BarPlayer />}
      <BottomTabBar {...props} />
    </View>
  );
};
