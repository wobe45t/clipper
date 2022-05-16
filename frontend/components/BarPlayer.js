import React, {useEffect, useCallback, useState} from 'react';
import {View, Image, Pressable, Modal, Text} from 'react-native';
import {default as MIcon} from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors, sizes} from '../constants/theme';
import {
  playerInfoAtom,
  playerPlaylistAtom,
  playerTrackAtom,
  showPlayerModalAtom,
} from '../state';
import {useSetRecoilState, useRecoilState} from 'recoil';
import {useTogglePlayPause, useTrackInfo, useKeyboard, useTrackProgress} from '../core';
import {useGenerateClip} from '../actions';
import {useNetInfo} from '@react-native-community/netinfo';

export const BarPlayer = () => {
  const keyboard = useKeyboard();
  const generateClip = useGenerateClip();
  const togglePlayPause = useTogglePlayPause();
  const netInfo = useNetInfo();

  const {name} = useTrackInfo()
  const [playerTrack, setPlayerTrack] = useRecoilState(playerTrackAtom);
  const [playerInfo, setPlayerInfo] = useRecoilState(playerInfoAtom);
  const [playerPlaylist, setPlayerPlaylist] = useRecoilState(playerPlaylistAtom)

  const {position, positionValue, duration} = useTrackProgress();

  const handleGenerateClip = () => {
    generateClip(playerTrack.id, Math.floor(positionValue));
  };

  const setShowPlayerModal = useSetRecoilState(showPlayerModalAtom);

  useEffect(() => {
    console.log('connection state changed');
  }, [netInfo.isConnected]);

  return (
    <View>
      {/* ===NOTIFICATION=== */}
      {!netInfo.isConnected && (
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>Internet connection is not available</Text>
        </View>
      )}
      {!keyboard.visible && (
        <Pressable onPress={() => setShowPlayerModal(true)}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
              height: sizes.image.small,
            }}>
            {playerTrack.id && (
              <>
                {/* DOUBLELINE */}
                <View style={{display: 'flex', flexGrow: 7}}>
                  <View
                    style={{
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{fontSize: 18}}>
                      {playerPlaylist && playerPlaylist.name}
                    </Text>
                    <Text style={{fontSize: 16, color: colors.p6}}>
                      {position} / {duration}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    display: 'flex',
                    flexGrow: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    marginRight: 5,
                  }}>
                  <Pressable onPress={handleGenerateClip}>
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: colors.sea,
                        borderRadius: 10,
                        padding: 5,
                        marginRight: 5,
                      }}>
                      <MIcon
                        name="bookmark-outline"
                        size={30}
                      />
                    </View>
                  </Pressable>
                  <Pressable onPress={togglePlayPause}>
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: colors.sea,
                        borderRadius: 10,
                      }}>
                      <MIcon
                        name={playerInfo && playerInfo.icon}
                        size={40}
                      />
                    </View>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </Pressable>
      )}
    </View>
  );
};
