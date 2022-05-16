import React, {useEffect, useState} from 'react';
import {CustomButton, CustomText, CustomSafeAreaView} from '../components';
import {
  View,
  Keyboard,
  Text,
  Pressable,
  ScrollView,
  FlatList,
} from 'react-native';
import {tagColors, colors} from '../constants/theme';
import {Modal, Input, Button} from 'native-base';
import {default as MIcon} from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {useAddTag, useDeleteTag} from '../actions';

export const CreateTagScreen = () => {
  const [value, setValue] = useState();
  const [colorsList, setColorsList] = useState();
  const [refreshList, setRefreshList] = useState(false);
  const navigation = useNavigation();
  const addTag = useAddTag();
  const deleteTag = useDeleteTag(); //TODO use

  const selectColor = color => {
    let tempColors = colorsList;
    tempColors.map(item => {
      if (color == item.color) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    });
    console.log(tempColors);
    setColorsList(tempColors);
    setRefreshList(!refreshList);
  };

  const createTag = () => {
    let tag = {};
    colorsList.map(item => {
      if (item.selected == true) {
        tag.color = item.color;
      }
    });
    tag.name = value;
    console.log(tag);
    addTag(tag);
  };

  useEffect(() => {
    let temp = [];
    tagColors.map(color => {
      temp.push({color: color, selected: false});
    });
    setColorsList(temp);
  }, []);

  return (
    <CustomSafeAreaView>
      <ScrollView style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'column',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {/* ===HEADER=== */}
          <View
            style={{
              height: '10%',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              flex: 0.1,
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
              <CustomText size="lg">create tag</CustomText>
            </View>
            <View style={{flexGrow: 9}}></View>
          </View>
          {/* ===BODY=== */}
          <View
            style={{
              // flexGrow: 9,
              flex: 0.9,
              width: '90%',
              flexDirection: 'column',
            }}>
            <View style={{marginVertical: 10}}>
              <CustomText size="md">Tag color</CustomText>
            </View>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                padding: 5,
                // width: '100%',
                borderColor: colors.sea,
                borderWidth: 1,
                borderRadius: 10,
                justifyContent: 'center',
              }}>
              {colorsList &&
                colorsList.map((item, index) => (
                  <Pressable
                    key={index}
                    onPress={() => selectColor(item.color)}>
                    <View
                      style={{
                        width: 50,
                        margin: 5,
                        height: 50,
                        borderRadius: 10,
                        backgroundColor: item.color,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      {item.selected && (
                        <MIcon name={'check'} size={30} color={colors.p3} />
                      )}
                    </View>
                  </Pressable>
                ))}
            </View>
            <View
              style={{
                justifyContent: 'center',
                width: '100%',
                alignItems: 'center',
                marginTop: '5%',
              }}>
              <Input
                placeholder="Type in name..."
                value={value}
                onChangeText={text => setValue(text)}
                onBlur={() => Keyboard.dismiss()}
                size="xl"
                w={{
                  base: '90%',
                }}
              />
            </View>
          </View>
          <View style={{flex: 1}} />
          <View style={{flex: 0.1, width: '100%'}}>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-around',
              }}>
              <CustomButton
                size="lg"
                onPress={() => {
                  createTag();
                  navigation.goBack();
                }}>
                Save
              </CustomButton>
            </View>
          </View>
        </View>
      </ScrollView>
    </CustomSafeAreaView>
  );
};
