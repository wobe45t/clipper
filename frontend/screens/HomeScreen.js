import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  View,
  SafeAreaView,
  Pressable,
  Text,
  RefreshControl,
  ScrollView,
  BackHandler,
} from 'react-native';
import {colors} from '../constants/theme';
import {Progress} from 'native-base';
import {SearchBar} from 'react-native-elements';
import {styles as androidStyles} from '../constants/safeArea';
import {Badge, PlaylistOptionsModal, MenuVert, CustomText} from '../components';
import {useFetchPlaylists, useGetTags} from '../actions';
import {
  useKeyboard,
  useRestoreState,
  usePlaylistProgress,
  useGetLastPlayedPlaylistProgress,
} from '../core';
import {useRecoilValue, useRecoilState, useSetRecoilState} from 'recoil';
import {
  playlistsAtom,
  filteredPlaylistsSelector,
  filterAtom,
  playerPlaylistAtom,
} from '../state';
import {playlistStyles, styles} from './HomeScreen.styles';

export const HomeScreen = () => {
  const keyboard = useKeyboard();
  const fetchPlaylists = useFetchPlaylists();
  const getLastPlayedPlaylistProgress = useGetLastPlayedPlaylistProgress();
  const restoreState = useRestoreState();
  const [playlists, setPlaylists] = useRecoilState(playlistsAtom);
  const [filteredPlaylists, setFilteredPlaylists] = useRecoilState(
    filteredPlaylistsSelector,
  );
  const [filter, setFilter] = useRecoilState(filterAtom);
  const [refreshing, setRefreshing] = useState(false);

  const searchFilterFunction = text => {
    setFilter(text);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    fetchPlaylists();
    setRefreshing(false);
  };

  useEffect(() => {
    const init = async () => {
      await fetchPlaylists();
      const playlistProgress = await getLastPlayedPlaylistProgress();
      if (playlistProgress) {
        if (!playlistProgress.completed) {
          restoreState(
            playlistProgress.playlist_id,
            playlistProgress.track_id,
            playlistProgress.progress,
          );
        }
      }
    };
    init();
  }, []);

  return (
    <SafeAreaView style={{flex: 1, ...androidStyles.AndroidSafeArea}}>
      <View style={styles.container}>
        {/* ===HEADER=== */}
        {!keyboard.visible && (
          <View style={styles.header}>
            <View style={{flexGrow: 1}} />
            <View
              style={{
                flexGrow: 4,
                justifyContent: 'center',
              }}>
              <CustomText size="lg" style={{textAlign: 'center'}}>
                Your playlists
              </CustomText>
            </View>
            <View
              style={{
                flexGrow: 1,
                justifyContent: 'center',
              }}
            />
          </View>
        )}
        {/* ===BODY=== */}
        <View style={styles.body}>
          <SearchBar
            round
            searchIcon={{size: 24}}
            onChangeText={text => searchFilterFunction(text)}
            onClear={text => searchFilterFunction('')}
            placeholder="Search by tags or name..."
            // placeholderTextColor={colors.p3}
            value={filter}
            containerStyle={styles.searchBar}
            inputContainerStyle={{backgroundColor: 'transparent'}}
          />
          {playlists.length == 0 && (
            <View style={{marginTop: 10}}>
              <CustomText size="sm">Add playlists on the website</CustomText>
            </View>
          )}
          <ScrollView
            keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl
                onRefresh={handleRefresh}
                refreshing={refreshing}
              />
            }>
            <View
              style={{
                alignItems: 'flex-start',
              }}>
              {filteredPlaylists &&
                filteredPlaylists.map((playlist, index) => (
                  <Playlist key={playlist.id} playlist={playlist} />
                ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const Playlist = ({playlist}) => {
  const navigation = useNavigation();
  const {completed, positionValue, durationValue, position, duration} =
    usePlaylistProgress(playlist);
  const playerPlaylist = useRecoilValue(playerPlaylistAtom);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => {
          navigation.navigate('Track', {playlistId: playlist.id, edit: false});
        }}
        onLongPress={() => {
          setShowModal(true);
        }}>
        <View style={playlistStyles.container}>
          <View
            style={{
              flexDirection: 'column',
              width: '90%',
            }}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}>
              {/* ===DOUBLE LINE=== */}
              <View
                style={{
                  flexDirection: 'column',
                  width: '73%',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-start',
                    marginLeft: 10,
                  }}>
                  <Text
                    style={{
                      textAlign: 'left',
                      color:
                        playerPlaylist.id == playlist.id
                          ? colors.orange
                          : colors.p3,
                      fontSize: 20,
                      letterSpacing: 1,
                      marginBottom: 10,
                    }}>
                    {playlist.name}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', marginLeft: 5}}>
                  {playlist.tags.map((tag, index) => (
                    <Badge key={index} color={tag.color}>
                      {tag.name}
                    </Badge>
                  ))}
                </View>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{width: '80%', padding: 10}}>
                {completed ? (
                  <CustomText size="sm">completed</CustomText>
                ) : (
                  <>
                    <Progress
                      colorScheme="primary"
                      size="xs"
                      bg="cyan.200"
                      value={positionValue}
                      max={durationValue}
                    />
                    <View style={{marginTop: 5}}>
                      <Text>
                        {position} / {duration}
                      </Text>
                    </View>
                  </>
                )}
              </View>
            </View>
          </View>
          <View style={{width: '10%'}}>
            <MenuVert
              onPress={() => {
                setShowModal(true);
              }}
            />
          </View>
        </View>
      </Pressable>
      <PlaylistOptionsModal
        playlist={playlist}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </>
  );
};
