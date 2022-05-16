import React from 'react';
import {ModalItem, ModalItemSeparator} from '.'
import {default as MIcon} from 'react-native-vector-icons/MaterialCommunityIcons'
import {Modal} from 'native-base'
import {Text,View} from 'react-native'
import {usePlayPlaylist} from '../core'
import {useDeletePlaylist} from '../actions'
import {useNavigation} from '@react-navigation/native'

export const PlaylistOptionsModal = ({playlist, showModal, setShowModal}) => {
  const playPlaylist = usePlayPlaylist(playlist.id);
  const navigation = useNavigation()
  const deletePlaylist = useDeletePlaylist()

  const handleDeletePlaylist = playlist_id => {
    deletePlaylist(playlist_id);
  };

  const handlePlayPlaylist = () => {
    playPlaylist(playlist) 
  }

  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>
          <Text style={{fontSize: 24}}>{playlist.name}</Text>
        </Modal.Header>
        <Modal.Body>
          <View style={{flexDirection: 'column', width: '100%'}}>
            <ModalItem
              onPress={() => {
                navigation.navigate('Track', {
                  playlistId: playlist.id,
                  edit: false,
                });
                setShowModal(false);
              }}
              icon={<MIcon name="chevron-right-box" size={30} />}>
              View playlist
            </ModalItem>
            <ModalItem
              onPress={() => {
                handlePlayPlaylist();
                setShowModal(false);
              }}
              icon={<MIcon name="play" size={30} />}>
              Play playlist
            </ModalItem>
            <ModalItemSeparator />
            <ModalItem
              onPress={() => {
                navigation.navigate('PlaylistTagEdit', {
                  playlist: playlist,
                });
                setShowModal(false);
              }}
              icon={<MIcon name="tag-multiple-outline" size={30} />}>
              Change tags
            </ModalItem>
            <ModalItemSeparator />
            <ModalItem
              onPress={() => {
                navigation.navigate('Track', {
                  playlistId: playlist.id,
                  edit: true,
                });
                setShowModal(false);
              }}
              icon={<MIcon name="playlist-edit" size={30} />}>
              Edit playlist
            </ModalItem>
            <ModalItemSeparator />
            <ModalItem
              onPress={() => {
                navigation.navigate('Clip', {
                  playlist: playlist,
                });
                setShowModal(false);
              }}
              icon={<MIcon name="bookmark-multiple-outline" size={30} />}>
              Show clips
            </ModalItem>
            <ModalItemSeparator />
            <ModalItem
              onPress={() => {
                handleDeletePlaylist(playlist.id);
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
  );
};
