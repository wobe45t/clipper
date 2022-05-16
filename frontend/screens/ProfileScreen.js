import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  View,
  SafeAreaView,
  Pressable,
  FlatList,
  Image,
  Text,
  RefreshControl,
  ScrollView,
} from 'react-native';
import {Modal} from 'native-base';
import {default as MIcon} from 'react-native-vector-icons/MaterialCommunityIcons';
import {default as Icon} from 'react-native-vector-icons/MaterialIcons';
import {colors, sizes} from '../constants/theme';
import {styles as androidStyles} from '../constants/safeArea';
import {useToast} from 'native-base';
import {ModalItem, CustomButton, CustomText, ModalItemSeparator, CustomSafeAreaView} from '../components';
import {useFocusEffect} from '@react-navigation/native';
import {useClearUserSession} from '../core';

export const ProfileScreen = () => {
  const navigation = useNavigation();

  const [showModal, setShowModal] = useState(false);
  const clearUserSession = useClearUserSession();

  return (
    <CustomSafeAreaView>
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          width: '100%',
          flex: 1
        }}>
        {/* ===HEADER=== */}
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 0.1,
            width: '100%'
          }}>
          <CustomText size='lg'>Profile</CustomText>
        </View>

        {/* ===BODY=== */}
        <View
          style={{
            width: '90%',
            flexDirection: 'column',
            flex: 0.9
          }}>
          <CustomButton
            onPress={() => {
              console.log('logout action');
              clearUserSession();
              navigation.navigate('Login');
            }}>
            Logout
          </CustomButton>

          <CustomButton
            onPress={() => {
              navigation.navigate('UpdateEmail');
            }}>
              Update email
          </CustomButton>
          <CustomButton
            onPress={() => {
              navigation.navigate('UpdatePassword');
            }}>
            Update password
          </CustomButton>
          <CustomButton
            onPress={() => {
              console.log('change server ip')
            }}>
              Change server address 
          </CustomButton>
        </View>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>
              <Text style={{fontSize: 24}}>{'modal'}</Text>
            </Modal.Header>
            <Modal.Body>
              <View style={{flexDirection: 'column', width: '100%'}}>
                <ModalItem></ModalItem>
                <ModalItemSeparator />
              </View>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </View>
    </CustomSafeAreaView>
  );
};