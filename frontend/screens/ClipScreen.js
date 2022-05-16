import React, {useEffect, useState} from 'react';
import {Text, ScrollView, Pressable, View} from 'react-native';
import {colors} from '../constants/theme';
import {useNavigation} from '@react-navigation/native';
import {default as MIcon} from 'react-native-vector-icons/MaterialIcons';
import {default as MCIcon} from 'react-native-vector-icons/MaterialCommunityIcons';
import {Modal} from 'native-base';
import {usePlayFile} from '../core';
import {useGetPlaylistClips, useDeleteClip} from '../actions';
import {
  CustomSafeAreaView,
  MenuVert,
  ModalItemSeparator,
  ModalItem,
  CustomText,
} from '../components';


export const ClipScreen = ({route}) => {
  const {playlist} = route.params;
  const navigation = useNavigation();
  const getPlaylistClips = useGetPlaylistClips();
  const playFile = usePlayFile();

  const [showModal, setShowModal] = useState(false);
  const [clips, setClips] = useState();
  const [selectedClip, setSelectedClip] = useState();
  const deleteClip = useDeleteClip();

  useEffect(() => {
    const fetchApi = async () => {
      const data = await getPlaylistClips(playlist.id);
      console.log(data);
      setClips(data);
    };
    fetchApi();
  }, []);

  const handlePlayClip = clip => {
    playFile(clip.file_id, playlist, clip.seconds);
  };

  const handleDeleteClip = () => {
    deleteClip(selectedClip.id);
  }

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
            justifyContent: 'flex-start',
            alignItems: 'center',
            flex: 0.1,
          }}>
          <View
            style={{
              flexGrow: 1,
              alignItems: 'center',
            }}>
            <Pressable onPress={() => navigation.goBack()}>
              <MIcon name={'arrow-left'} size={40} color={colors.p3} />
            </Pressable>
          </View>
          <View
            style={{
              flexGrow: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{fontSize: 24, textAlign: 'center'}}>
              {playlist.name}
            </Text>
          </View>
          <View style={{flexGrow: 9}}></View>
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
            {clips && clips.length > 0 ? (
              clips.map((clip, index) => (
                <Clip
                  key={index}
                  setSelectedClip={setSelectedClip}
                  setShowModal={setShowModal}
                  clip={clip}
                />
              ))
            ) : (
              <View style={{width: '100%', justifyContent: 'center'}}>
                <Text
                  style={{
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}>
                  No bookmarks found
                </Text>
              </View>
            )}
          </ScrollView>
        </View>

        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>
              <Text style={{fontSize: 24}}>Clip</Text>
            </Modal.Header>
            <Modal.Body>
              <View style={{flexDirection: 'column', width: '100%'}}>
                <ModalItem
                  onPress={() => {
                    handlePlayClip(selectedClip);
                    setShowModal(false);
                  }}
                  icon={<MCIcon name="play" size={30} />}>
                  Play clip
                </ModalItem>
                <ModalItemSeparator />
                <ModalItem
                  onPress={() => {
                    navigation.navigate('ClipDetails', {clip: selectedClip});
                    setShowModal(false);
                  }}
                  icon={<MIcon name="edit" size={30} />}>
                  Edit clip
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
      </View>
    </CustomSafeAreaView>
  );
};

const Clip = ({clip, setShowModal, setSelectedClip}) => {
  const navigation = useNavigation();

  const parseDatetime = datetime => {
    const date = new Date(datetime);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <Pressable
      onPress={() => {
        navigation.navigate('ClipDetails', {clip: clip});
      }}
      onLongPress={() => {
        setSelectedClip(clip);
        setShowModal(true);
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
            width: '90%',
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <CustomText size="sm">{parseDatetime(clip.date)}</CustomText>
            {clip.note && <CustomText size="sm">note added</CustomText>}
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
              {clip.text}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={{width: '80%', padding: 10}}>
              <View style={{marginTop: 5}}></View>
            </View>
          </View>
        </View>
        <View style={{width: '10%'}}>
          <MenuVert
            onPress={() => {
              setSelectedClip(clip);
              setShowModal(true);
            }} />
        </View>
      </View>
    </Pressable>
  );
};
