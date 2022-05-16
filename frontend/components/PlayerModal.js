import React, {useEffect, useCallback, useState} from 'react';
import {View, Image, Pressable, Modal, Text} from 'react-native';
import {Modal as BaseModal} from 'native-base';
import {default as MIcon} from 'react-native-vector-icons/MaterialCommunityIcons';
import {Slider} from 'react-native-elements';
import {colors, sizes} from '../constants/theme';
import {
  PlaybackSpeedModal,
  CustomText,
  ModalItem,
  CustomSafeAreaView,
  MIcon as Icon,
  CustomButton,
} from '../components';
import {useNavigation} from '@react-navigation/native';
import {
  playerInfoAtom,
  showPlayerModalAtom,
  playerPlaylistAtom,
  playerTrackAtom,
  currentPlaylistAtom,
} from '../state';
import {useRecoilValue, useRecoilState} from 'recoil';
import {
  useTogglePlayPause,
  useSeekTo,
  useJumpBackward,
  useJumpForward,
  useKeyboard,
  useTrackInfo,
  useSkipToNext,
  useSkipToPrevious,
  useTrackProgress,
  useInterval,
  useUpdatePlaylistProgress,
} from '../core';
import {useGenerateClip} from '../actions';
import {usePlaybackState, useProgress, State} from 'react-native-track-player';
import {styles} from './PlayerModal.styles';

export const PlayerModal = () => {
  const [showPlayerModal, setShowPlayerModal] =
    useRecoilState(showPlayerModalAtom);
  const [showMenuModal, setShowMenuModal] = useState(false);

  const navigation = useNavigation();
  const generateClip = useGenerateClip();
  const skipToNext = useSkipToNext();
  const skipToPrevious = useSkipToPrevious();
  const togglePlayPause = useTogglePlayPause();
  const jumpBackward = useJumpBackward();
  const jumpForward = useJumpForward();
  const seekTo = useSeekTo();
  const updatePlaylistProgress = useUpdatePlaylistProgress();

  const [playerTrack, setPlayerTrack] = useRecoilState(playerTrackAtom);
  const [playerInfo, setPlayerInfo] = useRecoilState(playerInfoAtom);
  const [playerPlaylist, setPlayerPlaylist] =
    useRecoilState(playerPlaylistAtom);
  const [showPlaybackModal, setShowPlaybackModal] = useState(false);
  const {position, positionValue, duration, durationValue} = useTrackProgress();

  const {name} = useTrackInfo();

  const handleSchedulePlayPause = () => {
    console.log('handleSchedulePlayPause');
  };

  const handleGenerateClip = () => {
    generateClip(playerTrack.id, Math.floor(positionValue));
  };

  useInterval(async () => {
    if (playerPlaylist.saving == true) {
      updatePlaylistProgress(playerPlaylist.id, playerTrack.id, positionValue);
    }
  }, 10000);

  const playbackState = usePlaybackState();

  useEffect(() => {
    if (playbackState == State.Playing) {
      setPlayerInfo({...playerInfo, icon: 'pause', playing: true});
    } else if (playbackState == State.Paused) {
      setPlayerInfo({...playerInfo, icon: 'play', playing: false});
    }
  }, [playbackState]);

  return (
    <View>
      <Modal
        visible={showPlayerModal}
        animationType="slide"
        onRequestClose={() => setShowPlayerModal(false)}>
        <CustomSafeAreaView>
          <View style={styles.container}>
            {/* ===HEADER=== */}
            <View style={styles.header}>
              <View style={{flexGrow: 1}}>
                <Icon
                  onPress={() => setShowPlayerModal(false)}
                  name="chevron-down"
                />
              </View>
              <View style={{flexGrow: 5}}>
                {/* <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <CustomText size="lg">
                    {playerPlaylist && playerPlaylist.name}
                  </CustomText>
                </View> */}
              </View>
              <View style={{flexGrow: 1}}></View>
            </View>
            {/* ===BODY=== */}
            <View style={styles.body}>
              <View style={{flex: 0.8}} />
              <Text
                numberOfLines={3}
                ellipsizeMode="tail"
                style={{
                  fontSize: 20,
                  textAlign: 'center',
                }}>
                {name}
              </Text>
              {/* ===PLAYER=== */}
              <View style={styles.playerContainer}>
                <Slider
                  value={positionValue}
                  allowTouchTrack={true}
                  onSlidingComplete={value => seekTo(value)}
                  minimumValue={0}
                  maximumValue={durationValue}
                  step={1}
                  trackStyle={{height: 10, backgroundColor: 'transparent'}}
                  thumbStyle={{
                    height: 20,
                    width: 20,
                    backgroundColor: colors.orange,
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{textAlign: 'center', color: colors.p6}}>
                    {position}
                  </Text>
                  <Text style={{textAlign: 'center', color: colors.p6}}>
                    {duration}
                  </Text>
                </View>
                <View style={styles.playerRow}>
                  <Icon onPress={skipToPrevious} name="arrow-left" />
                  <Icon
                    name="rewind-10"
                    onPress={() => jumpBackward(positionValue)}
                  />
                  <Icon
                    onPress={togglePlayPause}
                    size={60}
                    name={playerInfo && playerInfo.icon}
                  />
                  <Icon
                    name="fast-forward-10"
                    onPress={() => jumpForward(positionValue)}
                  />

                  <Icon onPress={skipToNext} name="arrow-right" />
                </View>
                <View style={[styles.playerRow, {marginBottom: 10}]}>
                  <Pressable onPress={() => setShowPlaybackModal(true)}>
                    <CustomText size="lg">
                      {playerInfo && playerInfo.rate?.toFixed(1)}x
                    </CustomText>
                  </Pressable>

                  {/* <Icon
                    name="moon-waning-crescent"
                    onPress={handleSchedulePlayPause}
                  /> */}

                  <Icon
                    onPress={() => setShowMenuModal(true)}
                    name="bookmark-multiple-outline"
                  />
                </View>
                <CustomButton onPress={handleGenerateClip}>
                  Bookmark
                </CustomButton>
              </View>
            </View>
          </View>
        </CustomSafeAreaView>
      </Modal>

      <PlaybackSpeedModal
        isOpen={showPlaybackModal}
        onClose={setShowPlaybackModal}
      />

      <BaseModal isOpen={showMenuModal} onClose={() => setShowMenuModal(false)}>
        <BaseModal.Content maxWidth="400px">
          <BaseModal.CloseButton />
          <BaseModal.Header>
            <Text style={{fontSize: 24}}>
              {playerPlaylist && playerPlaylist.name}
            </Text>
          </BaseModal.Header>
          <BaseModal.Body>
            <View style={{flexDirection: 'column', width: '100%'}}>
              <ModalItem
                onPress={() => {
                  navigation.navigate('Clip', {
                    playlist: playerPlaylist,
                  });
                  setShowMenuModal(false);
                  setShowPlayerModal(false);
                }}>
                Show clips
              </ModalItem>
            </View>
          </BaseModal.Body>
        </BaseModal.Content>
      </BaseModal>
    </View>
  );
};
