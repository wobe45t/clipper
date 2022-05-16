import React, {useEffect, useState} from 'react';
import {View, FlatList, Text, Pressable} from 'react-native';
import {Badge} from '../components'
import {default as MIcon} from 'react-native-vector-icons/MaterialCommunityIcons';
import { tagAtom } from '../state';
import {useRecoilState} from 'recoil'


export const TagScreen = () => {
  const tags = useRecoilState(tagAtom)


  return (
    <View
      style={{
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '100%',
        height: '100%',
      }}>
      <View
        style={{flexGrow: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text
          style={{fontSize: 20, textAlign:'center', textTransform: 'uppercase', letterSpacing: 2}}>
          Your Tags
        </Text>
      </View>
      <View style={{flexGrow: 9}}>
          <FlatList //TODO FIX 
            data={tags}
            renderItem={({item}) => (
              <View style={{flexDirection: 'row', alignItems:'center'}}>
                <Badge size="big" color={item.color}>
                  {item.name}
                </Badge>
                <Pressable onPress={() => deleteTag(item.id)} >
                  <MIcon name='delete' size={30} />
                </Pressable>
              </View>
            )}
            keyExtractor={item => item.id}
          />
      </View>
      <View style={{flex: 1, padding: 10}}>
        <Pressable onPress={() => setShowTagModal(true)}>
          <Text style={{fontSize: 20}}>Add tag</Text>
        </Pressable>
      </View>
    </View>
  );
};