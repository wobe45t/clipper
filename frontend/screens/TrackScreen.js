import React, {useState, useEffect} from 'react';
import {View, FlatList, Pressable, Text} from 'react-native';
import {default as MCIcon} from 'react-native-vector-icons/MaterialCommunityIcons';
import {default as MIcon} from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../constants/theme';
import {
  CustomSafeAreaView,
  MenuVert,
  BarPlayer,
  ModalItem,
  ModalItemSeparator,
  UpdateNameModal,
} from '../components';
import {Modal} from 'native-base';
import {usePlayFile, usePlayPlaylist} from '../core';
import {
  playlistSelector,
  playerInfoAtom,
  playerTrackAtom,
  playerPlaylistAtom,
  playlistProgressAtoms,
  currentPlaylistAtom,
} from '../state';
import {
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
  waitForAll,
} from 'recoil';
import {useUpdatePlaylistName, useUpdateFileName} from '../actions';
import {
  useGetPlaylistProgress,
  usePlaylistProgress,
  useUpdatePlaylistProgress,
} from '../core';

export const TrackScreen = ({route}) => {
  const {playlistId} = route.params;
  const playlist = useRecoilValue(playlistSelector(playlistId));

  const updatePlaylistName = useUpdatePlaylistName();
  const updateFileName = useUpdateFileName();

  const navigation = useNavigation();
  const [selectedFile, setSelectedFile] = useState();
  const [showModal, setShowModal] = useState(false);

  const [showPlaylistNameModal, setShowPlaylistNameModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState();
  const [showFileNameModal, setShowFileNameModal] = useState(false);
  const [newFileName, setNewFileName] = useState();

  const playFile = usePlayFile();

  const handlePlayNewFile = async file_id => {
    playFile(file_id, playlist);
  };

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
          flex: 0.9,
        }}>
        {/* ===HEADER=== */}
        <View
          style={{
            height: '10%',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
          <View
            style={{
              flexGrow: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Pressable onPress={() => navigation.goBack()}>
              <MCIcon name={'arrow-left'} size={40} color={colors.p3} />
            </Pressable>
          </View>
          <View
            style={{
              flexGrow: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{fontSize: 24, textAlign: 'center'}}>
              {playlist && playlist.name}
            </Text>
          </View>
          <View style={{flexGrow: 9}}></View>
          <View style={{flexGrow: 1}}>
            <MenuVert
              onPress={() => {
                setShowPlaylistNameModal(true);
                setNewPlaylistName(playlist.name);
              }}
            />
          </View>
        </View>
        {/* ===BODY=== */}
        <View
          style={{
            flexGrow: 9,
            width: '90%',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
          <View style={{flex: 1}}>
            {playlist && (
              <FlatList
                data={playlist.files}
                renderItem={({item}) => (
                  <File
                    file={item}
                    setShowModal={setShowModal}
                    setSelectedFile={setSelectedFile}
                    handlePlayNewFile={handlePlayNewFile}
                  />
                )}
                keyExtractor={item => item.name}
              />
            )}
          </View>
        </View>
      </View>

      <UpdateNameModal
        show={showPlaylistNameModal}
        setShow={setShowPlaylistNameModal}
        value={newPlaylistName}
        setValue={setNewPlaylistName}
        onSubmit={() => {
          updatePlaylistName(playlist.id, newPlaylistName);
        }}
      />

      <UpdateNameModal
        show={showFileNameModal}
        setShow={setShowFileNameModal}
        value={newFileName}
        setValue={setNewFileName}
        onSubmit={() => {
          updateFileName(selectedFile.id, playlist.id, newFileName);
        }}
      />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Body>
            <View style={{flexDirection: 'column', width: '100%'}}>
              <ModalItem
                onPress={() => {
                  setShowModal(false);
                  setShowFileNameModal(true);
                  setNewFileName(selectedFile.name);
                }}
                icon={<MIcon name="edit" size={30} />}>
                Edit name
              </ModalItem>
              <ModalItemSeparator />
              <ModalItem
                onPress={() => {
                  handleDeleteClip(selectedClip);
                  setShowModal(false);
                }}
                icon={<MIcon name="delete" size={30} />}
                variant="warning">
                Delete
              </ModalItem>
            </View>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <View style={{flex: 0.1, width: '100%'}}>
        <BarPlayer />
      </View>
    </CustomSafeAreaView>
  );
};

const File = ({file, setSelectedFile, setShowModal, handlePlayNewFile}) => {
  const navigation = useNavigation();
  const playerTrack = useRecoilValue(playerTrackAtom);
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        marginTop: 10,
      }}>
      <Pressable
        onLongPress={() => {
          setShowModal(true);
          setSelectedFile(file);
        }}
        onPress={() => {
          handlePlayNewFile(file.id);
        }}>
        <View
          style={{
            padding: 10,
            borderWidth: 1,
            borderRadius: 10,
            borderColor: colors.sea,
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
          }}>
          <View style={{width: '15%'}}>
            <MCIcon name={'music'} size={30} color={colors.p3} />
          </View>
          <View style={{width: '75%'}}>
            <Text
              style={{
                color: file.id == playerTrack.id ? colors.orange : colors.p3,
                textAlign: 'justify',
                fontSize: 20,
              }}>
              {file.name}
            </Text>
          </View>
          <View style={{width: '10%'}}>
            <MenuVert
              onPress={() => {
                setSelectedFile(file);
                setShowModal(true);
              }}
            />
          </View>
        </View>
      </Pressable>
    </View>
  );
};
