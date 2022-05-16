import React, {useEffect, useState} from 'react';
import {
  View,
  Pressable,
  TouchableOpacity,
  ScrollView,
  Text,
} from 'react-native';
import {useRecoilValue} from 'recoil';
import {playlistsAtom} from '../state';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../constants/theme';
import {default as MIcon} from 'react-native-vector-icons/MaterialIcons';
import {default as MCIcon} from 'react-native-vector-icons/MaterialCommunityIcons';
import {Modal} from 'native-base';
import {
  CustomSafeAreaView,
  MenuVert,
  ModalItemSeparator,
  ModalItem,
  CustomText,
} from '../components';

export const PlaylistClips = () => {
  const playlists = useRecoilValue(playlistsAtom);
  const navigation = useNavigation();

  return (
    <CustomSafeAreaView>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}>
        {/* ===HEADER=== */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 0.1,
            width: '100%'
          }}>
          <CustomText size='lg'>Bookmarks</CustomText>
        </View>

        {/* ===BODY=== */}
        <View
          style={{
            width: '90%',
            flexDirection: 'column',
            flex: 0.9,
          }}>
          <ScrollView
            contentContainerStyle={{
              marginTop: '5%',
              width: '100%',
              alignItems: 'center',
            }}>
            {playlists.map((playlist, index) => (
              <Playlist key={index} playlist={playlist} />
            ))}
          </ScrollView>
        </View>
      </View>
    </CustomSafeAreaView>
  );
};

const Playlist = ({playlist}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Clip', {playlist: playlist});
      }}>
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          marginTop: 10,
          borderWidth: 1,
          borderRadius: 10,
          borderColor: colors.sea,
          alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'column',
            width: '100%',
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <CustomText size='sm'>bookmarks: {playlist.id}</CustomText >
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              marginTop: 10,
            }}>
            {/* ===DOUBLE LINE=== */}
            <Text
              style={{
                textAlign: 'left',
                fontSize: 20,
                letterSpacing: 1,
              }}>
              {playlist.name}
            </Text>
          </View>
          {/* <View style={{flexDirection: 'row'}}>
            <View style={{width: '80%', padding: 10}}>
              <View style={{marginTop: 5}}></View>
            </View>
          </View> */}
        </View>
        {/* <View style={{width: '10%'}}>
          <MenuVert
            onPress={() => {
              setSelectedClip(clip);
              setShowModal(true);
            }} />
        </View> */}
      </View>
    </TouchableOpacity>
  );
};
