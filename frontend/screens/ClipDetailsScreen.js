import React, {useEffect, useState} from 'react';
import {
  TouchableWithoutFeedback,
  Text,
  TextInput,
  Pressable,
  FlatList,
  View,
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {colors} from '../constants/theme';
import {default as MIcon} from 'react-native-vector-icons/MaterialIcons';
import {CustomSafeAreaView, CustomText} from '../components';
import {useNavigation} from '@react-navigation/native';
import {useUpdateClip} from '../actions'

export const ClipDetailsScreen = ({route}) => {
  const {clip} = route.params;
  const navigation = useNavigation();
  const [textValue, setTextValue] = useState();
  const [edit, setEdit] = useState(false);
  const [note, setNote] = useState(false);
  const [noteValue, setNoteValue] = useState(
    'aadksakdadkdjadasdjaksdasjdaskdjaksdjakdajdkadjaskdjaskdjaksdakdadsksadadasdggadfgadfgdagdfgdsgfdsgsdfgsdfgsdfgsdfgsdfgsdgfsdgsdfgsdfgsdadksakdadkdjadasdjaksdasjdaskdjaksdjakdajdkadjaskdjaskdjaksdakdadsksadadasdggadfgadfgdagdfgdsgfdsgsdfgsdfgsdfgsdfgsdfgsdgfsdgsdfgsdfgsddksakdadkdjadasdjaksdasjdaskdjaksdjakdajdkadjaskdjaskdjaksdakdadsksadadasdggadfgadfgdagdfgdsgfdsgsdfgsdfgsdfgsdfgsdfgsdgfsdgsdfgsdfgsd',
  );
  const [notePrompt, setNotePrompt] = useState('add note');
  const updateClip = useUpdateClip()

  useEffect(() => {
    setNotePrompt(note ? 'remove note' : 'add note');
    if(!note) {
      setNoteValue('')
    }
  }, [note]);

  useEffect(() => {
    setTextValue(clip.text);
    setNoteValue(clip.note)
    if(clip.note) {
      setNote(true)
    }
    console.log(clip);
  }, []);

  const handleUpdateClip = () => {
    let c = {}
    if(textValue != clip.text) {
      c.text = textValue
    }
    if(noteValue != clip.note && noteValue != '') {
      c.note = noteValue
    }
    if(Object.keys(c).length == 0) {
      console.log('nothing to update')
      //TODO display global message
      return
    }
    console.log(JSON.stringify(c))
    updateClip(clip.id, c)
  };

  return (
    <>
      {/* STICKY HEADER */}
      <View
        style={{
          flex: 0.15,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 10,
          padding: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{flex: 0.2, alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MIcon name={'arrow-left'} size={40} color={colors.p3} />
            </TouchableOpacity>
          </View>
          <View style={{flex: 0.6, alignItems: 'center'}}>
            {/* <CustomText>Sticky header</CustomText> */}
          </View>
          <View style={{flex: 0.2}}>
            <TouchableOpacity
              onPress={() => {
                Keyboard.dismiss();
                handleUpdateClip();
              }}>
              <CustomText size="lg">save </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={{flex: 0.8}}>
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
          {/* ===BODY=== */}
          <Text
            style={{
              textTransform: 'uppercase',
              fontSize: 20,
              letterSpacing: 0.7,
            }}>
            Transcription
          </Text>
          <View
            style={{
              flex: 0.9,
              width: '90%',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                borderStyle: 'solid',
                borderColor: colors.sea,
                borderWidth: 1,
                borderRadius: 10,
              }}>
              <TextInput
                numberOfLines={7}
                multiline
                onSubmitEditing={Keyboard.dismiss}
                onFocus={() => setEdit(true)}
                onBlur={() => setEdit(false)}
                value={textValue}
                onChangeText={text => setTextValue(text)}
                style={{fontSize: 20, letterSpacing: 0.7, textAlign: 'justify'}}
              />
            </View>
          </View>
          <View style={{marginTop: '5%'}}>
            <TouchableOpacity
              onPress={() => {
                setNote(!note);
              }}>
              <Text
                style={{
                  fontSize: 20,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}>
                {notePrompt}
              </Text>
            </TouchableOpacity>
          </View>
          {note && (
            // <View style={{justifyContent: 'center'}}>
            <View
              style={{
                width: '90%',
                borderStyle: 'solid',
                borderColor: colors.sea,
                borderWidth: 1,
                borderRadius: 10,
              }}>
              <TextInput
                textAlign="center"
                onSubmitEditing={Keyboard.dismiss}
                multiline
                value={noteValue}
                onChangeText={text => setNoteValue(text)}
                style={{
                  fontSize: 20,
                  textDecorationColor: 'transparent',
                  letterSpacing: 0.7,
                  textAlign: 'justify',
                  width: '100%',
                }}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderColor: colors.sea,
    borderWidth: 1,
    borderStyle: 'solid',
  },
});
