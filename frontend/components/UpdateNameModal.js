import React, {useState, useEffect} from 'react';
import {Modal, Input} from 'native-base';
import {colors} from '../constants/theme';
import {
  ScrollView,
  TouchableWithoutFeedback,
  Pressable,
  Text,
  Keyboard,
  View,
  TextInput
} from 'react-native';
import {useKeyboard} from '../core';

export const UpdateNameModal = ({show, setShow, onSubmit, value, setValue}) => {
  const keyboard = useKeyboard();
  return (
    // <Pressable onPress={Keyboard.dismiss}>
    <Modal isOpen={show} onClose={() => setShow(false)}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>
          <Text style={{fontSize: 24}}>Update name</Text>
        </Modal.Header>
        <Modal.Body>
          <ScrollView keyboardShouldPersistTaps='handled'>
            <View
              style={{
                flexDirection: 'column',
                width: '100%',
                alignItems: 'center',
              }}>
              <Input
                value={value}
                onChangeText={text => setValue(text)}
                onBlur={() => Keyboard.dismiss()}
                size="xl"
                w={{base: '100%'}}
              />
              <Pressable
                onPress={() => {
                  onSubmit();
                  setShow(false);
                }}>
                <View
                  style={{
                    padding: 5,
                    borderRadius: 10,
                    borderColor: colors.sea,
                    borderWidth: 1,
                    marginTop: 20,
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                    }}>
                    update name
                  </Text>
                </View>
              </Pressable>
            </View>
          </ScrollView>
        </Modal.Body>
      </Modal.Content>
    </Modal>
    // </Pressable>
  );
};
