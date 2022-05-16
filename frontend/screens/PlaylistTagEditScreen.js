import React, {useState, useEffect} from 'react';
import {View, Text, Pressable} from 'react-native';
import {default as MIcon} from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {useToast} from 'native-base';
import {CustomSafeAreaView, Badge} from '../components';
import {colors} from '../constants/theme';
import {useFocusEffect} from '@react-navigation/native';
import {tagAtom} from '../state';
import {useRecoilState, useRecoilValue} from 'recoil';
import {useGetTags, useUpdatePlaylistTags} from '../actions';

export const PlaylistTagEditScreen = ({route}) => {
  const {playlist} = route.params;
  const tags = useRecoilValue(tagAtom);
  const updatePlaylistTags = useUpdatePlaylistTags();
  const getTags = useGetTags();

  const navigation = useNavigation();
  const toast = useToast();

  const [deleteList, setDeleteList] = useState([]);
  const [playlistTags, setPlaylistTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  // const availableTags = useRecoilValue()

  const setupStates = () => {
    console.log('tags : ', tags);
    setPlaylistTags(playlist.tags);
    let tempPlaylistTagsId = playlist.tags.map(tag => tag.id);
    console.log(tempPlaylistTagsId);
    let tempAvailableTags = tags.filter(
      tag => !tempPlaylistTagsId.includes(tag.id),
    );
    console.log(tempAvailableTags);
    setAvailableTags(tempAvailableTags);
  };

  useEffect(() => {
    const init = async () => {
      await getTags();
    };
    if (tags) {
      setupStates();
    } else {
      if (!toast.isActive(1)) {
        toast.show({
          id: 1,
          title: tagState.message.get(),
          duration: 2000,
        });
      }
    }
  }, []);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     setupStates(); //TODO ID.1
  //   }, []),
  // );

  const addTag = tag => {
    if (playlistTags.length >= 3) {
      if (!toast.isActive(1)) {
        toast.show({
          id: 1,
          variant: 'error',
          description: "You can't add more than 3 tags",
          duration: 2000,
        });
      }
      return;
    }
    let tempAvailableTags = availableTags.filter(t => tag.id != t.id);
    setAvailableTags(tempAvailableTags);
    let tempPlaylistTags = [...playlistTags, tag];
    setPlaylistTags(tempPlaylistTags);
  };

  const removeTag = tag => {
    let tempPlaylistTags = playlistTags.filter(t => tag.id != t.id);
    setPlaylistTags(tempPlaylistTags);
    let tempAvailableTags = availableTags;
    tempAvailableTags.push(tag);
    setAvailableTags(tempAvailableTags);
  };

  const confirmChange = () => {
    navigation.goBack();
    // console.log(playlist.id, playlistTags, playlist)
    updatePlaylistTags(playlist.id, playlistTags);
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
          color: colors.p8,
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
            flexGrow: 1,
          }}>
          <View
            style={{
              flexGrow: 1,
              alignItems: 'center',
              justifyContent: 'center',
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
            flexGrow: 9,
            width: '90%',
            flexDirection: 'column',
          }}>
          <View style={{}}>
            <Text
              style={{
                textTransform: 'uppercase',
                textAlign: 'left',
                fontSize: 20,
                letterSpacing: 1,
              }}>
              Current tags
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              padding: 5,
              width: '100%',
              borderColor: colors.sea,
              borderWidth: 1,
              borderRadius: 10,
            }}>
            {playlistTags.length > 0 ? (
              playlistTags.map((tag, index) => (
                <Pressable
                  key={tag.id}
                  onPress={() => {
                    console.log('remove tag', tag.id);
                    removeTag(tag);
                  }}>
                  <Badge size="medium" color={tag.color}>
                    {tag.name}
                  </Badge>
                </Pressable>
              ))
            ) : (
              <Text>No tags added</Text>
            )}
          </View>
          {/* SPACER */}
          <View style={{marginTop: 20}} />
          {/* AVAILABLE TAGS */}
          <View>
            <Text
              style={{
                textTransform: 'uppercase',
                fontSize: 20,
                letterSpacing: 1,
              }}>
              Available tags
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              padding: 5,
              height: '50%',
              overflowY: 'scroll',
              width: '100%',
              borderColor: colors.sea,
              borderWidth: 1,
              borderRadius: 10,
            }}>
            {availableTags.length > 0 ? (
              availableTags.map((tag, index) => (
                <Pressable
                  key={tag.id}
                  onPress={() => {
                    console.log('add tag', tag.id);
                    addTag(tag);
                  }}
                  onLongPress={() => console.log('rmeove')}>
                  <Badge size="medium" color={tag.color}>
                    {tag.name}
                  </Badge>
                </Pressable>
              ))
            ) : (
              <Text>No available tags left</Text>
            )}
          </View>
          <Pressable onPress={() => navigation.navigate('CreateTag')}>
            <Text
              style={{
                fontSize: 16,
                textTransform: 'uppercase',
                letterSpacing: 2,
              }}>
              Add new tag
            </Text>
          </Pressable>
          {deleteList.length > 0 && (
            <Pressable onPress={() => deleteTags()}>
              <Text
                style={{
                  fontSize: 18,
                  color: colors.redWarning,
                  textTransform: 'uppercase',
                  letterSpacing: 2,
                }}>
                Delete selected
              </Text>
            </Pressable>
          )}
        </View>
      </View>
      <View style={{flex: 0.1, width: '100%'}}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}>
          <Pressable
            onPress={() => {
              confirmChange();
            }}>
            <View
              style={{
                padding: 10,
                paddingLeft: 20,
                paddingRight: 20,
                borderWidth: 1,
                borderColor: 'green',
                borderRadius: 5,
                borderStyle: 'solid',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: 24,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  textAlign: 'center',
                }}>
                Save
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    </CustomSafeAreaView>
  );
};
